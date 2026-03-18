"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Table, Badge } from "react-bootstrap";

import { FetchBranchUsers, DeleteUser } from "./user_fetches";
import { User, UserRole } from "./user_types";
import { AttendModal } from "./user_modals";

import { ConfirmModal, NotifyModal } from "@/app/components/modals";

export default function BranchUsers(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await FetchBranchUsers();
      if (!fetchedUsers) {
        setMessage("Failed to load branch's users.");
        setNotifyModal(true);
      }
      if (fetchedUsers?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
      }

      const responseBody = fetchedUsers?.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
      }
      if (responseBody?.message && responseBody?.branch_users) {
        setMessage(responseBody.message);
        setUsers(responseBody?.branch_users);
      }
    };
    void loadUsers();
  }, [router]);

  return (
    <Container>
      <>
        <NotifyModal
          show={notifyModal}
          onHide={() => setNotifyModal(false)}
          title="User Fetching Error"
          message={message}
        />
        <h1>Branch&apos;s Users</h1>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Full name</th>
              <th>E-mail</th>
              <th>Role</th>
              <th>Attended?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length < 1 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No users exist in this branch.
                </td>
              </tr>
            ) : (
              users.map((user) => <BranchUser key={user.email} user={user} />)
            )}
          </tbody>
        </Table>
      </>
    </Container>
  );
}

function BranchUser({ user }: { user: User }): React.JSX.Element {
  const [message, setMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [attendModal, setAttendModal] = useState<boolean>(false);
  const [removeModal, setRemoveModal] = useState<boolean>(false);

  const roleBadge = (role: UserRole): React.JSX.Element => {
    const roleMap: Record<UserRole, { text: string; color: string }> = {
      [UserRole.ADMINISTRATOR]: { text: "ADMINISTRATOR", color: "danger" },
      [UserRole.MANAGER]: { text: "MANAGER", color: "warning" },
      [UserRole.STAFF]: { text: "STAFF", color: "primary" },
    };

    const { text: roleText, color: badgeColor } = roleMap[role] || {
      text: "UNKNOWN",
      color: "secondary",
    };

    return (
      <Badge bg={badgeColor} className="p-2">
        {roleText}
      </Badge>
    );
  };

  const RemoveUser = async (email: string) => {
    const response = await DeleteUser(email);
    if (!response) {
      setMessage("Failed to perform user removal.");
      setRemoveModal(true);
    }
    if (response?.status !== 200) {
      setMessage(response.data.message);
      setRemoveModal(true);
    }
    const responseBody = response?.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
    }
    if (responseBody?.message) {
      setMessage(responseBody?.message);
    }

    setRemoveModal(true);

    window.location.reload();
  };

  return (
    <>
      <ConfirmModal
        show={confirmModal}
        onHide={() => setConfirmModal(false)}
        onClick={() => {
          void RemoveUser(user.email);
          setConfirmModal(false);
        }}
        title="Confirm User Removal"
        body="Are you sure you want to remove the user?"
        footer="Confirm Removal"
      />
      <NotifyModal
        show={removeModal}
        onHide={() => setRemoveModal(false)}
        title="User Removal"
        message={message}
      />
      <AttendModal show={attendModal} onHide={() => setAttendModal(false)} />
      <tr>
        <td>
          {user.firstName} {user.lastName}
        </td>
        <td>{user.email}</td>
        <td>{roleBadge(user.role)}</td>
        <td>
          {user.attended ? (
            <input type="checkbox" checked disabled />
          ) : (
            <input type="checkbox" disabled />
          )}
        </td>
        <td>
          <Button onClick={() => setAttendModal(true)} variant="primary">
            Attend
          </Button>
          <Button variant="warning" className="ms-2">
            <Link
              href={`users/${user.email}`}
              className="text-white text-decoration-none"
            >
              Edit
            </Link>
          </Button>
          <Button
            onClick={() => setConfirmModal(true)}
            variant="danger"
            className="ms-2"
          >
            Remove
          </Button>
        </td>
      </tr>
    </>
  );
}
