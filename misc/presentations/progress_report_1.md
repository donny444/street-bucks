---
marp: true
---

# 1st Semester Progress Report
## POS System for Cafe Franchise

---

## Team Members

- 65200125 นาย ตุลยวัต ชนูดหอม
- 65200162 นาย ธนาดร รัชตะปีติ

## Advisors

1. อาจารย์ นภัสรพี สิทธิวัจน์ (Advisor)
2. อาจารย์ อรรถศาสตร์ นาคเทวัญ (Co-advisor)

---

# ที่มาและความสำคัญของโครงงาน
## (Origin and Importance of the Project)

โครงงานนี้เกิดจากความสนใจของผู้จัดทำที่มองเห็นปัญหาในการบริหารจัดการร้านกาแฟขนาดเล็กถึงขนาดกลางที่ยังไม่มีระบบ POS ที่สามารถรองรับการทำงานในหลายสาขา หรือมีระบบที่ครอบคลุมฟังก์ชันที่จำเป็นในชีวิตจริง เช่น การตรวจสอบการเข้างานของพนักงาน การวิเคราะห์ยอดขายแบบเรียลไทม์ หรือการจัดการสต็อกวัตถุดิบตามสูตรของแต่ละเมนู ซึ่งฟังก์ชันเหล่านี้ล้วนเป็นสิ่งที่มีความจำเป็นต่อการดำเนินธุรกิจแฟรนไชส์ในระยะยาว

---

# ที่มาและความสำคัญของโครงงาน [2]
## (Origin and Importance of the Project) [2]

นอกจากนี้ ผู้จัดทำยังเล็งเห็นว่าโครงการนี้สามารถนำไปต่อยอดในอนาคตได้ ทั้งในเชิงของการพัฒนาเป็นระบบ POS สำหรับธุรกิจจริง หรือการสร้างเป็นผลิตภัณฑ์ต้นแบบ (Prototype) เพื่อใช้นำเสนอแนวคิดเชิงธุรกิจต่อผู้ประกอบการหรือในเวทีแข่งขันโครงงานต่าง ๆ ได้อีกด้วย ด้วยเหตุนี้เอง จึงเป็นแรงบันดาลใจให้ผู้จัดทำเลือกพัฒนาโครงงานระบบ POS สำหรับแฟรนไชส์ร้านกาแฟ โดยใช้เทคโนโลยีที่ทันสมัย และออกแบบระบบให้สามารถปรับขยายได้ในอนาคต

---

# POS System

POS ย่อมาจาก Point of Sale หรือ "จุดขาย" หมายถึงระบบที่ใช้ในการจัดการกระบวนการขายหน้าร้าน ตั้งแต่การรับออเดอร์ คำนวณราคา คิดเงิน ไปจนถึงการออกใบเสร็จและรายงานยอดขาย โดยทั่วไปมักเรียกว่า เครื่อง POS โปรแกรม POS เครื่องคิดเงิน เครื่องแคชเชียร์ หรือเครื่องคิดเงิน POS เป็นต้น

สำหรับ ระบบ POS ร้านค้า คือระบบจัดการร้านค้าแบบครบวงจรที่รวมทั้งการขายหน้าร้าน (Front of House: FOH) และการบริหารจัดการหลังร้าน (Back of House: BOH) เข้าไว้ด้วยกัน เพื่อช่วยอำนวยความสะดวกและเพิ่มประสิทธิภาพให้กับธุรกิจร้านค้า

**Source:** https://www.wongnai.com/pos-articles/what-is-pos

---

# Web Application

Web application หรือชื่อเต็มว่า web-based application คือ การเขียนระบบ application ให้สามารถใช้งานได้ในรูปแบบของเว็บไซต์บนหน้า browser ปกติได้โดยที่ไม่จำเป็นต้องดาวน์โหลดแอปเพิ่มเติม

Web Application แตกต่างกับ website ทั่วไปตรงที่ website ปกติจะเป็นหน้าเว็บที่ให้ข้อมูลแก่ผู้ใช้ เช่น เว็บไซต์ข่าว บล็อก หรือเว็บไซต์องค์กรที่มีเนื้อหาคงที่หรือมีการอัปเดตเป็นครั้งคราว ส่วน web application จะเป็นเว็บไซต์ที่มีการโต้ตอบกับผู้ใช้มากขึ้น

**Source:** https://www.cubesofttech.com/blog/what-is-web-application

---

# วัตถุประสงค์ของโครงงาน
## (Objectives of the Project)

1. พัฒนาระบบ POS ที่มีลักษณะเป็น Web Application
2. พัฒนาระบบ POS ให้สามารถใช้งานได้ตามที่กำหนดไว้จาก Requirements
3. ออกแบบและสร้างฐานข้อมูลให้สามารถรองรับการดำเนินการของระบบ POS
4. พัฒนา Program สำหรับการวิเคราะห์ข้อมูลจากข้อมูลการดำเนินธุรกิจที่เก็บไว้ในฐานข้อมูล
5. นำระบบ POS รวมทั้งส่วนอื่นๆ ที่ได้พัฒนาไปทดสอบการใช้งานบนสภาพแวดล้อมจริง (Servers, Networks, IT Devices)

---

# ขอบเขตของโครงงาน
## (Scopes of the Project)

- 3 roles in the system: staff, manager, administrator.
- Database server ที่รองรับการเข้าถึงจากระบบร้านกาแฟในหลายๆ สาขา
- Dashboard สำหรับวิเคราะห์การขายของแต่ละสาขา
- ตัว Software มีลักษณะเป็น Webapp
- การตรวจสอบการเข้างานของพนักงานโดย Manager
- การสร้างใบเสร็จการสั่งซื้อในรูปแบบ PDF จัดเก็บไฟล์บน Server
- การติดตามสต็อกของวัตถุดิบ
- การเพิ่ม, ลบ, แก้ไข Menus ของแฟรนไซส์โดย Administrator
- วิเคราะห์ข้อมูลการดำเนินธุรกิจแฟรนไซส์ในระดับ Administrator

---

# Tech Stack

- **Client:** Next.js, TypeScript, Bootstrap, *Chart.js*.
- **Server:** NestJS, *Swagger*.
- **Database:** PostgreSQL, Prisma (ORM), *DBeaver*.
- ***Utility:** ESLint, Prettier.*
- **Deployment, CI/CD:** Docker, Nginx, GitHub Actions, *Git*.
- **Testing:** Jest.
- **Data Analysis:** Python, NumPy, Pandas, or any related tools.

---

### 1) ตัวซอฟต์แวร์แบ่ง 3 ระดับผู้ใช้งาน: พนักงาน (Staff), ผู้จัดการสาขา (Manager), ผู้ดูแลระบบ (Administrator)

![User roles](./user_roles.svg "User Roles")

---

### 2) แดชบอร์ดเพื่อแสดงข้อมูลเชิงลึกของการขายของแต่ละสาขา

###### Sales in Week

![Sales in week](./sales_in_week.png "Sales in Week")

---

### 2) แดชบอร์ดเพื่อแสดงข้อมูลเชิงลึกของการขายของแต่ละสาขา [2]

###### Sales in Month

![Sales in month](./sales_in_month.png "Sales in Month")

---

### 2) แดชบอร์ดเพื่อแสดงข้อมูลเชิงลึกของการขายของแต่ละสาขา [3]

###### Annual Sales

![Annual sales](./annual_sales.png "Annual Sales")

---

### 3) ศึกษาข้อมูลวัตถุดิบของเมนูในร้านกาแฟ และการพัฒนาซอฟต์แวร์ Point of Sale (POS) สำหรับการดำเนินธุรกิจแฟรนไซส์

##### Hot Latte
- 2 milk
- 1 coffee beans
- 1 sugar

##### Iced Latte
- 2 milk
- 1 coffee beans
- 1 sugar
- 1 ice

---

### 3) ศึกษาข้อมูลวัตถุดิบของเมนูในร้านกาแฟ และการพัฒนาซอฟต์แวร์ Point of Sale (POS) สำหรับการดำเนินธุรกิจแฟรนไซส์ [2]

##### Hot Mocha
- 1 water
- 1 milk
- 1 coffee beans
- 1 sugar
- 1 cocoa powder

##### Iced Mocha
- 1 water
- 1 milk
- 1 coffee beans
- 1 sugar
- 1 cocoa powder
- 1 ice

---

### 3. ศึกษาข้อมูลวัตถุดิบของเมนูในร้านกาแฟ และการพัฒนาซอฟต์แวร์ Point of Sale (POS) สำหรับการดำเนินธุรกิจแฟรนไซส์ [3]

##### Espresso
- 1 water
- 1 coffee beans

##### Americano
- 2 water
- 1 coffee beans
- 1 sugar
- 1 ice

---

### 3. ศึกษาข้อมูลวัตถุดิบของเมนูในร้านกาแฟ และการพัฒนาซอฟต์แวร์ Point of Sale (POS) สำหรับการดำเนินธุรกิจแฟรนไซส์ [4]

##### Croissant
- 1 water
- 1 yeast
- 1 flour
- 1 butter
- 1 salt

##### Bagel
- 1 water
- 1 yeast
- 1 flour
- 1 sugar
- 1 salt

---

### 3. ศึกษาข้อมูลวัตถุดิบของเมนูในร้านกาแฟ และการพัฒนาซอฟต์แวร์ Point of Sale (POS) สำหรับการดำเนินธุรกิจแฟรนไซส์ [5]

##### Orange Cake
- 1 condensed milk
- 2 sugar
- 1 unsalted butter
- 1 egg
- 1 flour
- 1 whipped cream
- 2 orange jam
- 1 salt

##### Hamcheese Sandwich
- 1 sliced cheese
- 1 sliced ham
- 1 mayonnaise
- 2 sliced bread

---

### 3. ศึกษาข้อมูลวัตถุดิบของเมนูในร้านกาแฟ และการพัฒนาซอฟต์แวร์ Point of Sale (POS) สำหรับการดำเนินธุรกิจแฟรนไซส์ [6]

##### Sources:
https://www.allrecipes.com/recipe/96629/cafe-latte/
https://www.allrecipes.com/recipe/23538/mocha-coffee/
https://coffeegeek.com/guides/howtos/americano-how-to/
https://www.allrecipes.com/recipe/6916/croissants/
https://sallysbakingaddiction.com/homemade-bagels/
https://www.wongnai.com/recipes/orange-cake

---

### Updated ER Diagram (DBeaver Generated)

![DBeaver ER diagram](./dbeaver_er_diagram.png "DBeaver ER Diagram")

---

### Prisma Schema Definition

![Prisma schema definition](./prisma_schema.svg "Prisma Schema Definition")

---

### Docker Compose Configuration

![Docker compose configuration](./docker_compose_configuration.svg "Docker Compose Configuration")

---

# API Specification: Menu

![API specification: menu](./menu_apis.png "API Specification: Menu")

---

# API Specification: Order

![API specification: order](./order_apis.png "API Specification: Order")

---

# API Specification: User

![API specification: user](./user_apis.png "API Specification: User")

---

# API Specification: Insight

![API specification: insight](./insight_apis.png "API Specification: Insight")

---

# ประโยชน์ที่คาดว่าจะได้รับจากโครงงาน
## (Anticipated Benefits of the Project)

1. ตัวระบบ POS สามารถใช้ดำเนินการสั่งซื้อเมนูของแฟรนไซส์ร้านกาแฟได้
2. ตัวระบบ POS สามารถแสดง Data Visualization ของข้อมูลการขายของร้านกาแฟ
แต่ละสาขาได้
3. มีฐานข้อมูลที่สามารถรองรับการเข้าถึงและการดำเนินการต่างๆ จากระบบ POS
ในหลายๆ สาขาได้
4. สามารถใช้ข้อมูลที่มีในฐานข้อมูลมาทำ Data Analysis เพื่อวิเคราะห์ผลการดำเนินธุรกิจ
แฟรนไซส์ได้
5. โครงงานมีความสมบูรณ์ในระดับที่สามารถนำไปใช้ในการดำเนินธุรกิจจริงได้

---

# Resources

- API Specification in Postman/Swagger
- ER Diagram in draw.io/*DBeaver*
- UML Diagrams for Key Operations
- Figma Design
- Markdown Documentation
- Git Repository
- *Sitemap*

---

# Thanks for Listening
# Any Questions?