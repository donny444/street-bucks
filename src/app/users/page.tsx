"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Table, Badge, ButtonGroup } from "react-bootstrap";

import { ConfirmModal, NotifyModal } from "@/app/components/modals";

import AddIcon from "@/static/icons/add_icon.svg";
import EditIcon from "@/static/icons/edit_icon.svg";
import DeleteIcon from "@/static/icons/delete_icon.svg";
import AttendIcon from "@/static/icons/attend_icon.svg";

import { FetchBranchUsers, DeleteUser } from "./user_fetches";
import { User, UserRole } from "./user_types";
import { AttendModal, AddModal, EditorModal } from "./user_modals";

export default function BranchUsers(): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [notifyModal, setNotifyModal] = useState<boolean>(false);
  const [addModal, setAddModal] = useState<boolean>(false);

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
    <Container className="mt-3 d-flex flex-column gap-2">
      <NotifyModal
        show={notifyModal}
        onHide={() => setNotifyModal(false)}
        title="User Fetching Error"
        message={message}
      />
      <AddModal
        show={addModal}
        onHide={() => setAddModal(false)}
        title="User Sign-Up"
      />
      <Container className="d-flex justify-content-between align-items-center mb-3">
        <h1>Branch&apos;s Users</h1>
        <Button
          onClick={() => setAddModal(true)}
          variant="primary"
          className="p-2"
        >
          <Image
            src={AddIcon as StaticImageData}
            alt="Add"
            width={30}
            height={30}
          />
        </Button>
      </Container>
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
    </Container>
  );
}

function BranchUser({ user }: { user: User }): React.JSX.Element {
  const [message, setMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [editorModal, setEditorModal] = useState<boolean>(false);
  const [attendModal, setAttendModal] = useState<boolean>(false);
  const [removeModal, setRemoveModal] = useState<boolean>(false);

  const [editorEmail, setEditorEmail] = useState("");
  const [editorPassword, setEditorPassword] = useState("");

  const router = useRouter();

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
    const response = await DeleteUser(email, editorEmail, editorPassword);
    if (!response) {
      setMessage("Failed to perform user removal.");
      setRemoveModal(true);
      return;
    }
    if (response?.status === 401) {
      localStorage.removeItem("branch-token");
      router.push("/branches");
      return;
    }

    const responseBody = response?.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setRemoveModal(true);
      return;
    }
    if (responseBody?.message) {
      setMessage(responseBody.message);
      setRemoveModal(true);
      window.location.reload();
    }
  };

  return (
    <>
      <EditorModal
        show={editorModal}
        onHide={() => setEditorModal(false)}
        title="Manager Credentials"
        email={editorEmail}
        setEmail={setEditorEmail}
        password={editorPassword}
        setPassword={setEditorPassword}
        onSubmit={async (e) => {
          e.preventDefault();
          setEditorModal(false);
          setConfirmModal(true);
        }}
      />
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
      <AttendModal
        show={attendModal}
        onHide={() => setAttendModal(false)}
        userEmail={user.email}
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
          <ButtonGroup>
            <Button
              onClick={() => router.push(`/users/${user.email}`)}
              variant="warning"
            >
              <Image
                src={EditIcon as StaticImageData}
                alt="Edit"
                width={30}
                height={30}
              />
            </Button>
            <Button onClick={() => setEditorModal(true)} variant="danger">
              <Image
                src={DeleteIcon as StaticImageData}
                alt="Delete"
                width={30}
                height={30}
              />
            </Button>
            {!user.attended && (
              <Button onClick={() => setAttendModal(true)} variant="primary">
                <Image
                  src={AttendIcon as StaticImageData}
                  alt="Attend"
                  width={30}
                  height={30}
                />
              </Button>
            )}
          </ButtonGroup>
        </td>
      </tr>
    </>
  );
}
