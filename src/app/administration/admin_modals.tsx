"use client";

import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

import { Modal, Button, Form, Alert } from "react-bootstrap";

import {
  MenuCategory,
  MenuForm,
  MenuIngredient,
  IngredientEntry,
  RecipeForm,
} from "./admin_types";
import { AddMenu, AddRecipe, FetchIngredientList } from "./admin_fetches";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface AddMenuModalProps {
  show: boolean;
  onHide: () => void;
}
export function AddMenuModal({ show, onHide }: AddMenuModalProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {error && <Alert variant="danger">{message}</Alert>}
        <Modal.Title>Add Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddMenuForm message={message} setMessage={setMessage} error={error} setError={setError} onHide={onHide} />
      </Modal.Body>
    </Modal>
  );
}

interface AddRecipeModalProps {
  show: boolean;
  onHide: () => void;
}
export function AddRecipeModal({
  show,
  onHide,
}: AddRecipeModalProps): React.JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        {error && <Alert variant="danger">{message}</Alert>}
        <Modal.Title>Add Recipe</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AddRecipeForm
          setMessage={setMessage}
          setError={setError}
          onHide={onHide}
        />
      </Modal.Body>
    </Modal>
  );
}

interface AddRecipeFormProps {
  setMessage: (message: string) => void;
  setError: (error: boolean) => void;
  onHide: () => void;
}
function AddRecipeForm({
  setMessage,
  setError,
  onHide,
}: AddRecipeFormProps): React.JSX.Element {
  const [recipeForm, setRecipeForm] = useState<RecipeForm>({
    name: "",
    unit: "",
    file: null,
  });

  const router = useRouter();

  const handleAddRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (recipeForm.name.trim() === "") {
      setMessage("Recipe name is required.");
      setError(true);
      return;
    }
    if (recipeForm.unit.trim() === "") {
      setMessage("Recipe unit is required.");
      setError(true);
      return;
    }
    if (!recipeForm.file) {
      setMessage("Recipe image file is required.");
      setError(true);
      return;
    }

    const addedRecipe = await AddRecipe(recipeForm);
    if (!addedRecipe) {
      setMessage("Failed to add recipe.");
      setError(true);
      return;
    }
    const responseBody = addedRecipe.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      return;
    }
    if (responseBody?.message) {
      setError(false);
      onHide();
      router.refresh();
    }
  };

  return (
    <Form onSubmit={(e) => void handleAddRecipe(e)}>
      <Form.Group className="mb-3" controlId="formRecipeName">
        <Form.Label>Recipe Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter recipe name"
          value={recipeForm.name}
          onChange={(e) =>
            setRecipeForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formRecipeUnit">
        <Form.Label>Unit</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter recipe unit"
          value={recipeForm.unit}
          onChange={(e) =>
            setRecipeForm((prev) => ({ ...prev, unit: e.target.value }))
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formRecipeImage">
        <Form.Label>Upload Image File</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) =>
            setRecipeForm((prev) => ({
              ...prev,
              file: (e.target as HTMLInputElement).files
                ? (e.target as HTMLInputElement).files![0]
                : null,
            }))
          }
        />
      </Form.Group>
      <Button variant="primary" type="submit" className="w-100 mt-3">
        Add Recipe
      </Button>
    </Form>
  );
}

interface AddMenuFormProps {
  message: string;
  setMessage: (message: string) => void;
  error: boolean;
  setError: (error: boolean) => void;
  onHide: () => void;
}
function AddMenuForm({ message, setMessage, error, setError, onHide }: AddMenuFormProps): React.JSX.Element {
  const [menuForm, setMenuForm] = useState<MenuForm>({ name: "", price: 0, category: MenuCategory.HOT, file: null, ingredient: [], note: "" });
  const router = useRouter();
  const handleAddMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (menuForm.name.trim() === "") {
      setMessage("Menu name is required.");
      setError(true);
      return;
    }
    if (menuForm.price <= 0) {
      setMessage("Price must be greater than 0.");
      setError(true);
      return;
    }
    if (menuForm.category !== MenuCategory.HOT && menuForm.category !== MenuCategory.ICED && menuForm.category !== MenuCategory.BAKERY) {
      setMessage("Invalid category.");
      setError(true);
      return;
    }
    if (!menuForm.file) {
      setMessage("Menu image file is required.");
      setError(true);
      return;
    }

    const addedMenu = await AddMenu(menuForm);
    if (!addedMenu) {
      setMessage("Failed to add menu.");
      setError(true);
      return;
    }
    const responseBody = addedMenu.data;
    if (responseBody?.error) {
      setMessage(responseBody.error);
      setError(true);
      return;
    }
    if (responseBody?.message) {
      setMessage(responseBody.message);
      setError(false);
      onHide();
      router.refresh();
    }
  }

  return (
    <Form onSubmit={(e) => void handleAddMenu(e)}>
      <Form.Group className="mb-3" controlId="formMenuName">
        <Form.Label>Menu Name</Form.Label>
        <Form.Control type="text" placeholder="Enter menu name" value={menuForm?.name} onChange={(e) => setMenuForm((prev) => prev ? { ...prev, name: e.target.value } : prev)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formMenuPrice">
        <Form.Label>Price</Form.Label>
        <Form.Control type="number" placeholder="Enter price" value={menuForm?.price} onChange={(e) => setMenuForm((prev) => prev ? { ...prev, price: Number(e.target.value) } : prev)} />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formMenuCategory">
        <Form.Label>Category</Form.Label>
        <Form.Select
          value={menuForm?.category}
          onChange={(e) =>
            setMenuForm((prev) =>
              prev
                ? { ...prev, category: e.target.value as MenuCategory }
                : prev
            )
          }
        >
          <option value={MenuCategory.HOT}>{MenuCategory.HOT}</option>
          <option value={MenuCategory.ICED}>{MenuCategory.ICED}</option>
          <option value={MenuCategory.BAKERY}>
            {MenuCategory.BAKERY}
          </option>
        </Form.Select>
      </Form.Group>
      <Form.Group className="mb-3" controlId="formMenuImage">
        <Form.Label>Upload Image File</Form.Label>
        <Form.Control
          type="file"
          onChange={(e) =>
            setMenuForm((prev) =>
              prev
                ? {
                  ...prev,
                  file: (e.target as HTMLInputElement).files
                    ? (e.target as HTMLInputElement).files![0]
                    : null,
                }
                : prev
            )
          }
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formMenuNote">
        <Form.Label>Note (Optional)</Form.Label>
        <div data-color-mode="light">
          <MDEditor
            value={menuForm?.note || ""}
            onChange={(val) =>
              setMenuForm((prev) =>
                prev ? { ...prev, note: val || "" } : prev
              )
            }
            preview="edit"
          />
        </div>
      </Form.Group>
      <AddIngredientsSection
        message={message}
        setMessage={setMessage}
        setError={setError}
        menuForm={menuForm}
        setMenuForm={setMenuForm}
      />
      <Button variant="primary" type="submit" className="w-100 mt-3">Add Menu</Button>
    </Form>
  );
}

interface AddIngredientsSectionProps {
  message: string;
  setMessage: (msg: string) => void;
  setError: (err: boolean) => void;
  menuForm: MenuForm;
  setMenuForm: React.Dispatch<React.SetStateAction<MenuForm>>;
}
function AddIngredientsSection({
  message,
  setMessage,
  setError,
  menuForm,
  setMenuForm,
}: AddIngredientsSectionProps): React.JSX.Element {
  const [ingredientList, setIngredientList] = useState<IngredientEntry[]>([]);

  useEffect(() => {
    const loadIngredientList = async () => {
      const fetchedIngredientList = await FetchIngredientList();
      if (!fetchedIngredientList) {
        setMessage("Failed to load ingredient list.");
        setError(true);
        return;
      }

      const responseBody = fetchedIngredientList.data;
      if (responseBody?.error) {
        setMessage(responseBody.error);
        setError(true);
      }
      if (responseBody?.ingredient_list) {
        setIngredientList(responseBody.ingredient_list);
      }
    };
    void loadIngredientList();
  }, [setMessage, setError]);

  return (
    <div className="mt-4">
      <h5>Menu Ingredients</h5>
      {menuForm.ingredient?.map((ing, index) => {
        return (
          <IngredientField
            key={index}
            currentIngredient={ing}
            ingredientList={ingredientList}
            onAmountChange={(newAmount) => {
              setMenuForm((prev) => prev ? { ...prev, ingredient: prev.ingredient.map((i, ind) => ind === index ? { ...i, amount: newAmount } : i) } : prev);
            }}
            onRecipeChange={(newRecipeId) => {
              setMenuForm((prev) => prev ? { ...prev, ingredient: prev.ingredient.map((i, ind) => ind === index ? { ...i, recipeId: newRecipeId } : i) } : prev);
            }}
            onRemove={() => {
              setMenuForm((prev) => prev ? { ...prev, ingredient: prev.ingredient.filter((_, ind) => ind !== index) } : prev);
            }}
          />
        );
      })}
      {(menuForm.ingredient?.length || 0) >= 0 && (menuForm.ingredient?.length || 0) < 10 ? (
        <Button
          variant="success"
          onClick={() =>
            setMenuForm((prev) => prev ? {
              ...prev,
              ingredient: [
                ...(prev.ingredient || []),
                { recipeId: ingredientList[0] || "", amount: 1 } as MenuIngredient,
              ]
            } : prev)
          }
          className="w-100"
        >
          Add Ingredient
        </Button>
      ) : null}
    </div>
  );
}

function IngredientField({
  currentIngredient,
  ingredientList,
  onAmountChange,
  onRecipeChange,
  onRemove,
}: {
  currentIngredient: MenuIngredient;
  ingredientList: IngredientEntry[];
  onAmountChange: (newAmount: number) => void;
  onRecipeChange: (newRecipeId: string) => void;
  onRemove: () => void;
}): React.JSX.Element {
  return (
    <Form.Group
      className="d-flex gap-2 mb-3"
      controlId={`formIngredient_${currentIngredient.recipeId}`}
    >
      <Form.Select
        value={currentIngredient.recipeId}
        onChange={(e) => onRecipeChange(e.target.value)}
      >
        {ingredientList.map((ing, ind) => (
          <option key={ind} value={ing}>
            {ing}
          </option>
        ))}
      </Form.Select>
      <Form.Control
        type="number"
        value={currentIngredient.amount}
        onChange={(e) => onAmountChange(parseFloat(e.target.value))}
        min={1}
        max={8}
      />
      <Button
        variant="danger"
        onClick={onRemove}
      >
        Remove
      </Button>
    </Form.Group>
  );
}