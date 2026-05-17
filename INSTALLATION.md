# Installation Steps (English)

1. If you don't have Git on your machine (on Windows), install it first at https://git-scm.com/install before proceeding to the next step.
2. Execute the Git command below to pull the source code to your server machine.
    ```
    git clone --recursive --remote-submodules https://github.com/donny444/street-bucks.git
    ```
3. Locate the directory in which the source code was pulled to.
4. Install Docker and Docker Compose using the shell script in `docker_installation.sh` or batch script `docker_installation.bat` (for Windows) as they are prerequisites to run the application.
5. Execute the command: `docker compose up -d` to start containers running application.
6. Let client devices access the web via domain name that have been set on your server.

---

# ขั้นตอนการติดตั้ง (ไทย)

1. หากคุณยังไม่ได้ติดตั้ง Git ในเครื่องของคุณ (บน Windows) กรุณาติดตั้งที่ https://git-scm.com/install ก่อนดำเนินการขั้นตอนถัดไป
2. รันคำสั่ง Git ด้านล่างเพื่อดึงซอร์สโค้ดมายังเครื่องเซิร์ฟเวอร์ของคุณ
    ```
    git clone --recursive --remote-submodules https://github.com/donny444/street-bucks.git
    ```
3. ไปยังโฟลเดอร์ที่คุณได้ดึงซอร์สโค้ดมาไว้
4. ติดตั้ง Docker และ Docker Compose โดยใช้ shell script ใน `docker_installation.sh` หรือ batch script `docker_installation.bat` (สำหรับ Windows) เนื่องจากเป็นสิ่งที่จำเป็นในการรันแอปพลิเคชัน
5. รันคำสั่ง: `docker compose up -d` เพื่อเริ่มต้นคอนเทนเนอร์ที่รันแอปพลิเคชัน
6. อนุญาตให้เครื่องลูกข่าย (Client Devices) เข้าถึงเว็บแอปพลิเคชันผ่านชื่อโดเมนที่ได้ตั้งค่าไว้บนเซิร์ฟเวอร์ของคุณ