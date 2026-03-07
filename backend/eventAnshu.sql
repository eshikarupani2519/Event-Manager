DROP DATABASE IF EXISTS eventManagementSystem;

create database eventManagementSystem;
use eventManagementSystem;
drop table events;

CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(50),
    event_description VARCHAR(200),
    event_date DATE,
    timing TIME,
    event_type ENUM('Conference', 'Workshop', 'Meetup'),
    event_category JSON,
    event_mode ENUM('Online', 'Offline'),
    location varchar(150) default 'Virtual',
	created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    activeYN int default 1
);
alter table  events modify column event_mode ENUM('Online', 'Offline') NOT NULL;
CREATE TABLE attendees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(30)  NOT NULL,
    phone BIGINT NOT NULL,
    city varchar(40),
    state varchar(40),
    country varchar(40),
    password varchar(255),
    interests JSON,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    activeYN int default 1
);
CREATE TABLE hosts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50)  NOT NULL,
    email VARCHAR(30) NOT NULL,
    phone BIGINT NOT NULL,
    city varchar(40),
    state varchar(40),
    country varchar(40),
    password varchar(255),
    rating int default 0,
    no_of_events_hosted int default 0,
    categories JSON,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    activeYN int default 1
);

CREATE TABLE event_attendee (
    event_id INT,
    FOREIGN KEY (event_id)
        REFERENCES events (event_id),
    att_id INT,
    FOREIGN KEY (att_id)
        REFERENCES attendees (id)
);

CREATE TABLE event_host (
    event_id INT,
    FOREIGN KEY (event_id)
        REFERENCES events (event_id),
    host_id INT,
    FOREIGN KEY (host_id)
        REFERENCES hosts (id)
);

CREATE TABLE admin (
    username VARCHAR(30),
    password VARCHAR(20),
    role VARCHAR(20)
);
insert into admin values('admin','admin123','admin');

-- inserts
select * from events;
select * from attendees;
INSERT INTO events 
(event_name, event_description, event_date, timing, event_type, event_category, event_mode, location)
VALUES
('AI Conference 2026',
 'A conference discussing latest trends in AI and ML.',
 '2026-04-15',
 '10:00:00',
 'Conference',
 '["AI","Machine Learning","Data Science"]',
 'Offline',
 'Pune Convention Center'); 

INSERT INTO events 
(event_name, event_description, event_date, timing, event_type, event_category, event_mode)
VALUES
('Web Dev Bootcamp',
 'Hands-on workshop on modern web development.',
 '2026-05-10',
 '09:30:00',
 'Workshop',
 '["React","Node.js","Full Stack"]',
 'Online');
 
 INSERT INTO events 
(event_name, event_description, event_date, timing, event_type, event_category, event_mode, location)
VALUES
('Startup Meetup',
 'Networking event for entrepreneurs and investors.',
 '2026-06-01',
 '05:00:00',
 'Meetup',
 '["Startup","Business","Networking"]',
 'Offline',
 'Mumbai Business Hub');
 
 INSERT INTO attendees 
(name, email, phone, city, state, country, password, interests)
VALUES
('Eshika Rupani',
 'eshika@gmail.com',
 9876543210,
 'Pune',
 'Maharashtra',
 'India',
 'hashed_password_1',
 '["AI","Web Development"]');
 INSERT INTO attendees 
(name, email, phone, city, state, country, password, interests)
VALUES
('Rahul Sharma',
 'rahul@gmail.com',
 9123456780,
 'Mumbai',
 'Maharashtra',
 'India',
 'hashed_password_2',
 '["Startups","Networking"]');
 INSERT INTO attendees 
(name, email, phone, city, state, country, password, interests)
VALUES
('Sneha Patil',
 'sneha@gmail.com',
 9988776655,
 'Bangalore',
 'Karnataka',
 'India',
 'hashed_password_3',
 '["Machine Learning","Cloud"]');

INSERT INTO hosts 
(name, email, phone, city, state, country, password, rating, no_of_events_hosted, categories)
VALUES
('Amit Kulkarni',
 'amit@gmail.com',
 9871234560,
 'Pune',
 'Maharashtra',
 'India',
 'host_pass_1',
 4,
 10,
 '["AI","Data Science"]');
 INSERT INTO hosts 
(name, email, phone, city, state, country, password, rating, no_of_events_hosted, categories)
VALUES
('Priya Mehta',
 'priya@gmail.com',
 9812345678,
 'Mumbai',
 'Maharashtra',
 'India',
 'host_pass_2',
 5,
 15,
 '["Web Development","Cloud"]');
 INSERT INTO hosts 
(name, email, phone, city, state, country, password, rating, no_of_events_hosted, categories)
VALUES
('Karan Verma',
 'karan@gmail.com',
 9900112233,
 'Delhi',
 'Delhi',
 'India',
 'host_pass_3',
 3,
 5,
 '["Business","Startups"]');

INSERT INTO event_attendee (event_id, att_id)
VALUES (1,1);
INSERT INTO event_attendee (event_id, att_id)
VALUES (2,2);
INSERT INTO event_attendee (event_id, att_id)
VALUES (3,3);

INSERT INTO event_host (event_id, host_id)
VALUES (1,1);
INSERT INTO event_host (event_id, host_id)
VALUES (2,2);
INSERT INTO event_host (event_id, host_id)
VALUES (3,3);

ALTER TABLE events 
ADD COLUMN meeting_id VARCHAR(20),
ADD COLUMN meeting_link VARCHAR(255),
ADD COLUMN webinar_status ENUM('scheduled','live','ended') DEFAULT 'scheduled';
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attendee_id INT,
    event_id INT,
    message VARCHAR(255),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending','Sent') DEFAULT 'Pending',
    FOREIGN KEY (attendee_id) REFERENCES attendees(id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);
DESCRIBE attendees;

INSERT INTO event_attendee(event_id,att_id)
VALUES(4,4);

INSERT INTO event_attendee(event_id,att_id)
VALUES(10,1);

select * from events;
INSERT INTO event_attendee(event_id,att_id)
VALUES(6,4);


SELECT event_id,event_name,meeting_id,meeting_link FROM events;

ALTER TABLE notifications
ADD COLUMN reminder_type ENUM('1_DAY','30_MIN');

INSERT INTO events
(event_name,event_description,event_date,timing,event_type,event_category,event_mode)
VALUES
(
"CRON TEST WEBINAR AGAIN",
"Testing 1 day reminder email",
CURDATE(),
ADDTIME(CURTIME(),"00:02:00"),
"Workshop",
'["Testing"]',
"Online"
);

INSERT INTO event_attendee(event_id,att_id)
VALUES(12,5);

INSERT INTO event_attendee(event_id,att_id)
VALUES(11,1);

INSERT INTO event_attendee(event_id,att_id)
VALUES(16,7);

select * from event_attendee;
select * from attendees;
select * from events;

INSERT INTO attendees 
(name, email, phone, city, state, country, password, interests)
VALUES
('ANSHU SACHDEV',
 'anshusachdev22@gmail.com',
 9123456780,
 'Mumbai',
 'Maharashtra',
 'India',
 'hashed_password_2',
 '["Startups","Networking"]');
 DELETE from attendees where id=6;
select * from attendees; 
ALTER TABLE attendees

ADD COLUMN verification_token VARCHAR(255),
ADD COLUMN verified BOOLEAN DEFAULT FALSE;