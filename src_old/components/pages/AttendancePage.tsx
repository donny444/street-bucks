import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Calendar, Clock, LogIn, LogOut, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useBranch } from '../../contexts/BranchContext';
import { api } from '../../utils/api';
import { AttendanceRecord } from '../../types';

export function AttendancePage() {
  const { user } = useAuth();
  const { selectedBranch } = useBranch();
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Update current time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAttendanceData();
  }, [user, selectedBranch]);

  const loadAttendanceData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [todayRes, recentRes] = await Promise.all([
        api.attendance.getToday(),
        api.attendance.getRecent(10)
      ]);
      
      const today = todayRes.attendance || todayRes.data || null;
      const recent = recentRes.attendance || recentRes.data || [];
      
      setTodayRecord(today);
      setRecentRecords(recent);
    } catch (err: any) {
      console.error('Failed to fetch attendance:', err);
      setError('Failed to load attendance data');
      setTodayRecord(null);
      setRecentRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!user) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      const response = await api.attendance.checkIn(user.id);
      const newRecord = response.attendance || response.data;
      setTodayRecord(newRecord);
      loadAttendanceData();
    } catch (err: any) {
      console.error('Failed to check in:', err);
      setError(err.response?.data?.message || 'Failed to check in');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    
    setIsProcessing(true);
    setError(null);
    try {
      await api.attendance.checkOut(todayRecord.id);
      loadAttendanceData();
    } catch (err: any) {
      console.error('Failed to check out:', err);
      setError(err.response?.data?.message || 'Failed to check out');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (record: AttendanceRecord) => {
    if (record.checkOut) {
      return <Badge variant="secondary" className="bg-green-100 text-green-700">Completed</Badge>;
    }
    return <Badge variant="secondary" className="bg-blue-100 text-blue-700">Working</Badge>;
  };

  // Calculate stats for manager/admin view
  const calculateStats = () => {
    const todayRecords = recentRecords.filter(r => r.date === new Date().toISOString().split('T')[0]);
    const checkedIn = todayRecords.filter(r => !r.checkOut).length;
    const completed = todayRecords.filter(r => r.checkOut).length;
    
    return { todayRecords: todayRecords.length, checkedIn, completed };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Employee Attendance</h1>
          <p className="text-gray-500">Check-in/out and view attendance records</p>
        </div>
        <div className="text-right">
          <p className="text-gray-500 text-sm">Current Time</p>
          <p className="text-gray-900">
            {currentTime.toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Stats Cards for Manager/Admin */}
      {(user?.role === 'manager' || user?.role === 'admin') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Today's Staff</p>
                  <p className="text-gray-900 mt-1">{stats.todayRecords}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Currently Working</p>
                  <p className="text-gray-900 mt-1">{stats.checkedIn}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed Shifts</p>
                  <p className="text-gray-900 mt-1">{stats.completed}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Check In/Out Card - Only for staff */}
      {user?.role === 'staff' && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Attendance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!todayRecord ? (
              <div className="text-center py-8">
                <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't checked in today</p>
                <Button 
                  onClick={handleCheckIn}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Check In
                </Button>
              </div>
            ) : !todayRecord.checkOut ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="text-green-900">Checked In</p>
                    <p className="text-green-700 text-sm">{formatTime(todayRecord.checkIn)}</p>
                  </div>
                  <Badge className="bg-green-600">Working</Badge>
                </div>
                <Button 
                  onClick={handleCheckOut}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Check Out
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-green-900 text-sm">Check In</p>
                    <p className="text-green-700">{formatTime(todayRecord.checkIn)}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-blue-900 text-sm">Check Out</p>
                    <p className="text-blue-700">{formatTime(todayRecord.checkOut)}</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-purple-900 text-sm">Total Hours</p>
                  <p className="text-purple-700">{todayRecord.totalHours?.toFixed(2)} hours</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Attendance Records */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-gray-600 text-sm">Date</th>
                  {(user?.role === 'manager' || user?.role === 'admin') && (
                    <th className="text-left py-3 px-4 text-gray-600 text-sm">Employee</th>
                  )}
                  <th className="text-left py-3 px-4 text-gray-600 text-sm">Check In</th>
                  <th className="text-left py-3 px-4 text-gray-600 text-sm">Check Out</th>
                  <th className="text-left py-3 px-4 text-gray-600 text-sm">Total Hours</th>
                  <th className="text-left py-3 px-4 text-gray-600 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{formatDate(record.checkIn)}</td>
                    {(user?.role === 'manager' || user?.role === 'admin') && (
                      <td className="py-3 px-4 text-sm">{record.employeeName}</td>
                    )}
                    <td className="py-3 px-4 text-sm">{formatTime(record.checkIn)}</td>
                    <td className="py-3 px-4 text-sm">
                      {record.checkOut ? formatTime(record.checkOut) : '-'}
                    </td>
                    <td className="py-3 px-4 text-sm">
                      {record.totalHours ? `${record.totalHours.toFixed(2)} hrs` : '-'}
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(record)}</td>
                  </tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={user?.role === 'staff' ? 5 : 6} className="text-center py-8 text-gray-500">
                      No attendance records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
