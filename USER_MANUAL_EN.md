# Coffee Shop POS User Manual

This is a web-based point-of-sale (POS) and management system designed for multi-branch coffee shop operations. It allows staff to take orders and manage daily tasks, while administrators oversee all branches, menus, recipes, and users from a centralised panel.

---

## Table of Contents

1. [Getting Started](#1-getting-started)
2. [Application Layout](#2-application-layout)
3. [Branch Sign-In](#3-branch-sign-in)
4. [Menus & Ordering](#4-menus--ordering)
5. [Orders](#5-orders)
6. [Stocks](#6-stocks)
7. [Users](#7-users)
8. [Dashboard (Insights)](#8-dashboard-insights)
9. [Administration Panel](#9-administration-panel)
10. [Signing Out](#10-signing-out)

---

## 1. Getting Started

Open the coffee shop POS application in a web browser. On your first visit you will be directed to the **Branch Sign-In** page. All branch-level features (menus, orders, stocks, users, dashboard) require signing in to a specific branch first.

---

## 2. Application Layout

The interface is divided into three areas:

| Area | Description |
|---|---|
| **Sidebar** (left) | Green navigation panel with the application logo. Contains links to Dashboard, Menus, Orders, Stocks, and Users. A collapse/expand button lets you minimise it to icon-only mode. At the bottom are Admin Sign-In / Sign-Out controls. |
| **Main Content** (centre) | Displays the current page content. |
| **Footer** (bottom) | Shows the copyright notice at the bottom of the page. |

### Sidebar Navigation Items

- **Dashboard** — Sales analytics and charts.
- **Menus** — Browse menu items and place orders.
- **Orders** — View today's orders.
- **Stocks** — View and edit ingredient stock levels.
- **Users** — Manage branch staff.

---

## 3. Branch Sign-In

**Path:** `/branches`

Before using any feature, you must sign in to a branch.

1. A dropdown lists all available **Branch IDs**. Select the branch you belong to.
2. Enter the branch **Password**.
3. Click **Sign In**.

On success you are redirected to the Orders page. The branch token is stored in your browser so you remain signed in across page reloads.

If the token expires or becomes invalid, you will be automatically redirected back to this page.

---

## 4. Menus & Ordering

**Path:** `/menus`

The Menus section is where you browse available items and build an order.

### 4.1 Category Tabs

A tab bar at the top lets you switch between categories:

| Tab | Description |
|---|---|
| **Hot** | Hot beverages (coffees, teas, etc.) |
| **Iced** | Cold/iced beverages |
| **Bakery** | Pastries, cakes, and baked goods |
| **Cart** | Your current shopping cart (shows a badge with the item count) |

### 4.2 Browsing Menu Items

Each category page displays menu items as cards in a responsive grid. Every card shows:

- **Image** of the item
- **Name** of the item
- **Price** in THB (Thai Baht)
- An **Add** button

### 4.3 Adding Items to Cart

1. Click the **Add** button on a menu card.
2. A modal dialog opens showing a larger image and the price.
3. Use the **−** / **+** buttons (or type a number) to set the desired quantity (1–10).
4. Click **Add to Cart**.
5. The item is added and the Cart tab badge updates.

### 4.4 Managing the Cart

Navigate to the **Cart** tab. The page has two sections:

**Items in Cart (left)** — A table listing each item with:

| Column | Description |
|---|---|
| # | Row number |
| Image | Thumbnail of the item |
| Name | Item name |
| Subtotal | Price × quantity |
| Quantity | Adjustable with **−** / **+** buttons or direct input |
| Action | **Remove** button to delete the item from the cart |

**Cart Summary (right)** — Shows the total number of items and the grand total price, plus the **Place Order** button.

### 4.5 Placing an Order

1. Review your cart contents.
2. Click **Place Order**.
3. On success, an alert shows the new **Order ID**. The cart is cleared automatically.
4. If the cart is empty, you will be prompted to add items first.

---

## 5. Orders

**Path:** `/orders`

This page displays **Today's Orders** for the signed-in branch in a table:

| Column | Description |
|---|---|
| Order UUID | Unique identifier for the order |
| Timestamp | Date and time the order was placed |
| Total Price | Sum of all items in the order |
| Action | **Inspect** button to view details |

### 5.1 Order Detail

**Path:** `/orders/[uuid]`

Clicking **Inspect** opens the order detail page, which shows:

- **UUID** — The order's unique identifier.
- **Date-time** — When the order was created.
- **Total price** — The order total.
- **Entries** — A list of ordered items with quantity, name, and price.

Below the detail section, a **Receipt** viewer displays the order receipt as an embedded PDF document.

---

## 6. Stocks

**Path:** `/stocks`

The Stocks page shows all ingredients/recipes stocked at the current branch as a card grid. Each card displays:

- **Image** of the ingredient
- **Name** of the ingredient
- **Quantity** with its unit (e.g. grams, millilitres)
- An **Edit** button

### 6.1 Editing Stock Quantity

1. Click the **Edit** button on a stock card.
2. A modal opens showing the ingredient image and its current quantity.
3. Adjust the quantity using the **−** / **+** buttons or type a value directly (1–9999).
4. Click **Confirm** to save.
5. The page reloads with the updated quantity.

---

## 7. Users

**Path:** `/users`

The Users page lists all staff members registered under the current branch.

### 7.1 User List Table

| Column | Description |
|---|---|
| Full name | First and last name |
| E-mail | The user's email address |
| Role | Colour-coded badge: **ADMINISTRATOR** (red), **MANAGER** (yellow), **STAFF** (blue) |
| Attended? | Checkbox indicating whether the user has completed attendance |
| Actions | Edit, Delete, and Attend buttons |

### 7.2 Adding a New User

1. Click the **+** (Add) button at the top-right.
2. A "User Sign-Up" modal appears.
3. Fill in: **Email**, **First Name**, **Last Name**, and **Password**.
4. Click **Submit**. The page reloads with the new user in the table.

### 7.3 Editing a User

1. Click the **Edit** (pencil) button on the user's row.
2. You are taken to the user detail page (`/users/[email]`).
3. Modify any of the fields: Email, First Name, Last Name, Role, or Password.
4. Click **Submit**.
5. A "Manager Credentials" modal asks for an authorised manager/admin email and password to confirm the change.
6. After verification, the changes are saved.

### 7.4 Deleting a User

1. Click the **Delete** (trash) button on the user's row.
2. A "Manager Credentials" modal asks for an authorised manager/admin email and password.
3. After entering credentials, a confirmation dialog appears: "Are you sure you want to remove the user?"
4. Click **Confirm Removal** to proceed or close the dialog to cancel.

### 7.5 Recording Attendance

For users whose **Attended?** column is unchecked:

1. Click the **Attend** (check-mark) button.
2. An "Attendance Submission" modal appears with the user's email pre-filled.
3. Enter the user's **Password** to verify identity.
4. Click **Submit**. On success, the attendance checkbox is marked.

---

## 8. Dashboard (Insights)

**Path:** `/dashboard`

The Dashboard provides visual analytics for the current branch's sales data. It consists of three widgets:

### 8.1 Top Menus Sold (Pie Chart)

Located in the upper-left area. Shows the **top 5 best-selling menu items** as a pie chart.

Toggle between two views using the button group:
- **Quantity** — Ranked by number of units sold.
- **Revenue** — Ranked by total revenue generated.

### 8.2 Sales Count (Number Display)

Located in the upper-right area. Displays a single headline number showing total sales for a selected time period.

Toggle the period:
- **Daily** — Sales count for today.
- **Weekly** — Sales count for the current week.
- **Monthly** — Sales count for the current month.

### 8.3 Sales Over Time (Line / Bar Chart)

Located in the lower section, spanning the full width.

Toggle the period:
- **Weekly** — Line chart showing daily sales for the current week (days of the week on the x-axis).
- **Monthly** — Line chart showing daily sales for the current month (days of the month on the x-axis).
- **Annual** — Bar chart showing monthly sales for the current year, broken down by category (Hot, Iced, Bakery).

---

## 9. Administration Panel

The Administration panel is a separate, higher-privilege area for managing global data that applies across all branches.

### 9.1 Admin Sign-In

**Path:** `/administration`

Access the admin panel by clicking **Admin Sign-In** at the bottom of the sidebar.

1. Enter your administrator **Email** and **Password**.
2. Click **Sign In**.
3. On success, you are redirected to the Branches management page.

Once signed in, the sidebar bottom area changes to show:
- **To Admin Section** — Navigate back to the admin panel.
- **Sign-Out from Admin** — End the admin session.

### 9.2 Admin Navigation

The administration panel has its own tab bar at the top with five sections:

| Tab | Description |
|---|---|
| **Branches** | Manage all shop branches |
| **Menus** | Manage menu items globally |
| **Orders** | Look up any order by UUID |
| **Recipes** | Manage recipes/ingredients |
| **Users** | Search and view users across all branches |

### 9.3 Branch Management

**Path:** `/administration/branches`

Displays all branches as cards, each showing its **Branch ID**. An **Add** button (+ icon) allows creating a new branch.

### 9.4 Menu Management

**Path:** `/administration/menus`

Displays all menu items across all branches as cards. Each card shows:

- Item image
- Name
- Category badge: **HOT** (red), **ICED** (blue), **BAKERY** (yellow)
- Price in THB
- **Edit** button — Opens the menu detail page (`/administration/menus/[name]`) for editing.
- **Remove** button — Deletes the menu item.

Click the **+** (Add) button to create a new menu item via the Add Menu modal.

### 9.5 Order Lookup

**Path:** `/administration/orders`

Allows searching for any order across all branches by its UUID.

1. Enter the order **UUID** in the search field.
2. Click the search button.
3. If found, the order details are displayed in a table: UUID, Branch ID, Total Price, and Timestamp.

### 9.6 Recipe Management

**Path:** `/administration/recipes`

Displays all recipes as cards. Each card shows:

- Recipe image
- Name
- Unit of measurement
- **Edit** button — Opens the recipe detail page (`/administration/recipes/[name]`) for editing.
- **Remove** button — Deletes the recipe.

Click the **+** (Add) button to create a new recipe via the Add Recipe modal.

### 9.7 User Lookup

**Path:** `/administration/users`

Search for users across all branches by name.

1. Type a name (or partial name) in the search field.
2. Click the search button.
3. Results appear in a table showing: E-mail, Branch ID, First Name, Last Name, and Role (colour-coded badge).

---

## 10. Signing Out

### Branch Sign-Out

There is no explicit branch sign-out button. To sign out from a branch, clear the `branch-token` from your browser's local storage, or the token will expire automatically. You will be redirected to the Branch Sign-In page.

### Admin Sign-Out

1. In the sidebar, click **Sign-Out from Admin**.
2. The admin session token is removed and you are returned to the Admin Sign-In page.
3. The sidebar reverts to showing the **Admin Sign-In** button.

---

## Quick Reference

| Task | Where to Go |
|---|---|
| Sign in to a branch | `/branches` |
| Browse menu and add to cart | Menus → Hot / Iced / Bakery |
| View and place orders | Menus → Cart → Place Order |
| Check today's orders | Orders |
| View order receipt | Orders → Inspect |
| Update stock quantities | Stocks → Edit |
| Add / edit / remove staff | Users |
| Record staff attendance | Users → Attend button |
| View sales analytics | Dashboard |
| Manage branches (admin) | Administration → Branches |
| Manage menus globally (admin) | Administration → Menus |
| Look up any order (admin) | Administration → Orders |
| Manage recipes (admin) | Administration → Recipes |
| Search users globally (admin) | Administration → Users |
