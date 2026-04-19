"use client";

import { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Button, Card, Alert, Form } from "react-bootstrap";

import { FetchUserForm, EditUser } from "@/app/users/user_fetches";
import { UserRole } from "../user_types";
import { EditorModal } from "../user_modals";
import { UserField } from "../user_field";

import { NotifyModal } from "@/app/components/modals";

interface UserDetailProps {
  params: {
    email: string;
  };
}
export default function UserDetail({
  params,
}: UserDetailProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [editorModal, setEditorModal] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState<boolean>(false);

  const emailParam = params.email;
  const [email, setEmail] = useState<string>(emailParam);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [role, setRole] = useState<UserRole>(UserRole.STAFF);
  const [password, setPassword] = useState<string>("");

  const [editorEmail, setEditorEmail] = useState("");
  const [editorPassword, setEditorPassword] = useState("");

  const router = useRouter();

  useEffect(() => {
    const branchToken = localStorage.getItem("branch-token");
    if (!branchToken) {
      router.push("/branches");
    }
  }, [router]);

  useEffect(() => {
    const loadUser = async () => {
      const fetchedUser = await FetchUserForm(emailParam);
      if (!fetchedUser) {
        setError(true);
        setMessage("Failed to load user detail.");
        setErrorModal(true);
      }
      if (fetchedUser?.status === 401) {
        localStorage.removeItem("branch-token");
        router.push("/branches");
      }

      const responseBody = fetchedUser?.data;
      if (responseBody?.error) {
        setError(true);
        setMessage(responseBody.error);
        setErrorModal(true);
      }
      if (responseBody?.user_form) {
        setEmail(responseBody.user_form.email);
        setFirstName(responseBody.user_form.firstName);
        setLastName(responseBody.user_form.lastName);
        setRole(responseBody.user_form.role);
      }
    };
    void loadUser();
  }, [router, emailParam]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await EditUser(
      emailParam,
      {
        email,
        firstName,
        lastName,
        role,
      },
      password || undefined,
      editorEmail,
      editorPassword
    );
    if (!response) {
      setMessage("Failed to perform user edit.");
      setEditorModal(false);
      setErrorModal(true);
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
      setEditorModal(false);
      setErrorModal(true);
      return;
    }
    if (responseBody?.message) {
      setMessage(responseBody.message);
      setEditorModal(false);
      router.replace(`/users/${email}`);
    }
  };

  return (
    <Container>
      {error && <Alert variant="danger">{message}</Alert>}
      <NotifyModal
        show={errorModal}
        onHide={() => setErrorModal(false)}
        title="User Editing"
        message={message}
      />
      <EditorModal
        show={editorModal}
        onHide={() => setEditorModal(false)}
        title="Editor Credentials"
        email={editorEmail}
        setEmail={setEditorEmail}
        password={editorPassword}
        setPassword={setEditorPassword}
        onSubmit={handleEdit}
      />
      <Card className="w-75 mx-auto mt-5">
        <Card.Header>
          <Card.Title>Edit User Detail</Card.Title>
        </Card.Header>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            setEditorModal(true);
          }}
        >
          <Card.Body>
            {error ? (
              <p className="h3">User not found</p>
            ) : (
              <>
                <UserField label="Email" value={email} setEmail={setEmail} />
                <UserField
                  label="First Name"
                  value={firstName}
                  setFirstName={setFirstName}
                />
                <UserField
                  label="Last Name"
                  value={lastName}
                  setLastName={setLastName}
                />
                <UserField label="Role" value={role} setRole={setRole} />
                <UserField
                  label="Password"
                  value=""
                  setPassword={setPassword}
                />
              </>
            )}
          </Card.Body>
          <Card.Footer>
            <Button type="submit" variant="primary">
              Submit
            </Button>
          </Card.Footer>
        </Form>
      </Card>
    </Container>
  );
}
