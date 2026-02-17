"use client";

import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Table, Badge } from "react-bootstrap";

import { FetchBranchUsers, DeleteUser } from "./user_fetches";
import { User, UserRole } from "./user_types";
import { ConfirmModal, NotifyModal } from "../components/modals";

export default function BranchUsers(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const branchId = localStorage.getItem("branchId");
    if (!branchId) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadOrders = async () => {
      const fetchedUsers = await FetchBranchUsers();
      if (!fetchedUsers) {
        setMessage("Failed to load branch's users.");
        setNotifyModal(true);
      }

      const responseBody = fetchedUsers?.data;
      if (responseBody?.branch_users) {
        setUsers(responseBody.branch_users);
      }
    };
    loadOrders();
  }, []);

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
            {users.map((user) => (
              <BranchUser key={user.email} user={user} />
            ))}
          </tbody>
        </Table>
      </>
    </Container>
  );
}

function BranchUser({ user }: { user: User }): React.JSX.Element {
  const [removeModal, setRemoveModal] = useState<boolean>(false);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const roleBadge = (role: UserRole): React.JSX.Element => {
    let roleText = "UNKNOWN";
    let badgeColor = "secondary";

    switch (role) {
      case UserRole.ADMINISTRATOR:
        roleText = UserRole.ADMINISTRATOR.toUpperCase();
        badgeColor = "danger";
      case UserRole.MANAGER:
        roleText = UserRole.MANAGER.toUpperCase();
        badgeColor = "warning";
      case UserRole.STAFF:
        roleText = UserRole.STAFF.toUpperCase();
        badgeColor = "primary";
      default:
        return <Badge bg={badgeColor}>{roleText}</Badge>;
    }
  };

  const RemoveUser = async (email: string) => {
    const response = await DeleteUser(email);
    if (!response) {
      setMessage("Failed to perform user removal.");
      setRemoveModal(true);
      return;
    }
    if (response.status !== 200) {
      setMessage(response.data.message);
      setRemoveModal(true);
      return;
    }

    setMessage(response.data.message);
    setRemoveModal(true);

    // Reload the page to reflect the removed user
    window.location.reload();
  };

  return (
    <>
      <ConfirmModal
        show={confirmModal}
        onHide={() => setConfirmModal(false)}
        onClick={async () => {
          await RemoveUser(user.email);
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
          <Button variant="warning">
            <Link href={`orders/${user.email}`}>Edit</Link>
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
