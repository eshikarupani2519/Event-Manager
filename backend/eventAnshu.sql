DROP DATABASE IF EXISTS eventManagementSystem;

CREATE DATABASE eventManagementSystem;

USE eventManagementSystem;

-- ==========================================
-- USERS TABLE
-- ==========================================

CREATE TABLE users (

id INT PRIMARY KEY AUTO_INCREMENT,

name VARCHAR(50) NOT NULL,

email VARCHAR(100) NOT NULL UNIQUE,

phone BIGINT NOT NULL,

city VARCHAR(40),

state VARCHAR(40),

country VARCHAR(40),

password VARCHAR(255),

role ENUM('attendee','host') DEFAULT 'attendee',

interests JSON,

categories JSON,

rating INT DEFAULT 0,

no_of_events_hosted INT DEFAULT 0,

verification_token VARCHAR(255),

verified BOOLEAN DEFAULT FALSE,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,

activeYN INT DEFAULT 1


);

-- ==========================================
-- ADMIN TABLE
-- ==========================================

CREATE TABLE admin (


username VARCHAR(30) PRIMARY KEY,

password VARCHAR(255) NOT NULL,

role VARCHAR(20) DEFAULT 'admin'


);

INSERT INTO admin(username,password,role)
VALUES('admin','admin123','admin');

-- ==========================================
-- EVENTS TABLE
-- ==========================================

CREATE TABLE events (


event_id INT PRIMARY KEY AUTO_INCREMENT,

event_name VARCHAR(100) NOT NULL,

event_description VARCHAR(500),

event_date DATE,

timing TIME,

event_type ENUM(
    'Conference',
    'Workshop',
    'Meetup'
),

event_category JSON,

event_mode ENUM(
    'Online',
    'Offline'
) NOT NULL,

location VARCHAR(150)
DEFAULT 'Virtual',

total_seats INT DEFAULT NULL,

available_seats INT DEFAULT NULL,

meeting_id VARCHAR(50),

meeting_link VARCHAR(255),

webinar_status ENUM(
    'scheduled',
    'live',
    'ended'
) DEFAULT 'scheduled',

recording_url VARCHAR(255),

transcript LONGTEXT,

summary TEXT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP,

activeYN INT DEFAULT 1


);

-- ==========================================
-- EVENT REGISTRATIONS
-- ==========================================

CREATE TABLE event_registrations (

registration_id INT PRIMARY KEY AUTO_INCREMENT,

event_id INT NOT NULL,

user_id INT NOT NULL,

seats_booked INT DEFAULT 1,

status ENUM(
    'registered',
    'cancelled',
    'attended'
) DEFAULT 'registered',

registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

UNIQUE(event_id,user_id),

FOREIGN KEY(event_id)
    REFERENCES events(event_id)
    ON DELETE CASCADE,

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE


);

-- ==========================================
-- EVENT HOSTS
-- ==========================================

CREATE TABLE event_hosts (

event_id INT,

user_id INT,

PRIMARY KEY(event_id,user_id),

FOREIGN KEY(event_id)
    REFERENCES events(event_id)
    ON DELETE CASCADE,

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE


);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

CREATE TABLE notifications (


id INT PRIMARY KEY AUTO_INCREMENT,

user_id INT,

event_id INT,

message VARCHAR(255),

reminder_type ENUM(
    '1_DAY',
    '30_MIN'
),

status ENUM(
    'Pending',
    'Sent'
) DEFAULT 'Pending',

sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE,

FOREIGN KEY(event_id)
    REFERENCES events(event_id)
    ON DELETE CASCADE

);

-- ==========================================
-- SAMPLE USERS
-- ==========================================

INSERT INTO users
(
name,
email,
phone,
city,
state,
country,
password,
role,
interests
)
VALUES
(
'Anshu Sachdev',
'[anshu@gmail.com](mailto:anshu@gmail.com)',
9876543210,
'Mumbai',
'Maharashtra',
'India',
'123456',
'attendee',
'["AI","Web Development"]'
);

INSERT INTO users
(
name,
email,
phone,
city,
state,
country,
password,
role,
categories,
rating,
no_of_events_hosted
)
VALUES
(
'Amit Kulkarni',
'[amit@gmail.com](mailto:amit@gmail.com)',
9871234560,
'Pune',
'Maharashtra',
'India',
'host123',
'host',
'["AI","Data Science"]',
4,
10
);

-- ==========================================
-- SAMPLE EVENT
-- ==========================================

INSERT INTO events
(
event_name,
event_description,
event_date,
timing,
event_type,
event_category,
event_mode,
location,
total_seats,
available_seats
)
VALUES
(
'AI Conference 2026',
'Conference discussing latest AI trends',
'2026-12-10',
'10:00:00',
'Conference',
'["AI","ML"]',
'Offline',
'Pune Convention Center',
100,
100
);

-- ==========================================
-- SAMPLE HOST MAPPING
-- ==========================================

INSERT INTO event_hosts
(event_id,user_id)
VALUES
(1,2);

-- ==========================================
-- SAMPLE REGISTRATION
-- ==========================================

INSERT INTO event_registrations
(
event_id,
user_id,
seats_booked
)
VALUES
(
1,
1,
2
);

-- ==========================================
-- CHECK DATA
-- ==========================================

SELECT * FROM admin;
SELECT * FROM users;
SELECT * FROM events;
SELECT * FROM event_hosts;
SELECT * FROM event_registrations;
SELECT * FROM notifications;

ALTER TABLE events
ADD COLUMN ticket_price DECIMAL(10,2) DEFAULT 0;
