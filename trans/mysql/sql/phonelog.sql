

--by phone number--
SELECT t1.*,t2.name,t2.emailAddress,t2.companyName,t2.title,t2.department,t2.ext,t2.imageUrl, CONVERT(phoneLogId, UNSIGNED INTEGER) AS sortOrder from tb_phoneLog as t1
LEFT JOIN tb_storedContacts as t2 ON t1.phoneNumber = t2.phoneNumber AND t1.userId = t2.userId
WHERE t1.userId = 1
AND t1.phoneNumber = ''
ORDER BY t1.callDate DESC





--all records---
SELECT t1.*,t2.name,t2.emailAddress,t2.companyName,t2.title,t2.department,t2.ext,t2.imageUrl, CONVERT(phoneLogId, UNSIGNED INTEGER) AS sortOrder from tb_phoneLog as t1
LEFT JOIN tb_storedContacts as t2 ON t1.phoneNumber = t2.phoneNumber AND t1.userId = t2.userId
WHERE t1.userId = 1
ORDER BY t1.callDate DESC


--today



--yesterday





between UNIX_TIMESTAMP(subdate(current_date, 1)) and
        UNIX_TIMESTAMP(current_date)

WHERE t1.callDate >= UNIX_TIMESTAMP(CAST(NOW() - INTERVAL 1 DAY AS DATE))
  AND t1.callDate <= UNIX_TIMESTAMP(CAST(NOW() AS DATE));


--works---
FROM_UNIXTIME(CONVERT(SUBSTRING(callDate, 1, CHAR_LENGTH(callDate) - 3), UNSIGNED INTEGER)) AS `Date`
FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) AS `Date`
LEFT(callDate , 10)

TIMESTAMPDIFF(MINUTE, NOW(), CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER))
TIMESTAMPDIFF(MINUTE, NOW(), FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER))) AS minutesOld

---------------------
--extra for time
SELECT 
FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) AS entryDateTime,
LEFT(callDate, 10) AS epochEntry,
TIMESTAMPDIFF(WEEK, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS weeksOld,
TIMESTAMPDIFF(DAY, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS daysOld,
TIMESTAMPDIFF(MINUTE, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS minutesOld,
TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS secondsOld,
t1.*,t2.name,t2.emailAddress,t2.companyName,t2.title,t2.department,t2.ext,t2.imageUrl, CONVERT(phoneLogId, UNSIGNED INTEGER) AS sortOrder FROM tb_phoneLog AS t1
LEFT JOIN tb_storedContacts AS t2 ON t1.phoneNumber = t2.phoneNumber AND t1.userId = t2.userId
WHERE t1.userId = 1

ORDER BY t1.callDate DESC

---------------
SELECT 
FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) AS entryDateTime,
LEFT(callDate, 10) AS epochEntry,
TIMESTAMPDIFF(WEEK, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS weeksOld,
TIMESTAMPDIFF(DAY, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS daysOld,
TIMESTAMPDIFF(MINUTE, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS minutesOld,
TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS secondsOld,
(DATE(FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) ) = CURDATE())AS today,
(DATE(FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) ) = CURDATE())AS today,
t1.*,t2.name,t2.emailAddress,t2.companyName,t2.title,t2.department,t2.ext,t2.imageUrl, CONVERT(phoneLogId, UNSIGNED INTEGER) AS sortOrder FROM tb_phoneLog AS t1
LEFT JOIN tb_storedContacts AS t2 ON t1.phoneNumber = t2.phoneNumber AND t1.userId = t2.userId
WHERE t1.userId = 1
-- AND
-- TIMESTAMPDIFF(DAY, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) = 0

ORDER BY t1.callDate DESC


-----today and yesterday
SELECT 
FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) AS entryDateTime,
LEFT(callDate, 10) AS epochEntry,
TIMESTAMPDIFF(WEEK, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS weeksOld,
TIMESTAMPDIFF(DAY, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS daysOld,
TIMESTAMPDIFF(MINUTE, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS minutesOld,
TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS secondsOld,
(DATE(FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) ) = CURDATE())AS today,
(DATE(FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) ) = DATE_SUB(CURDATE(),INTERVAL 1 DAY))AS yesterday,
t1.*,t2.name,t2.emailAddress,t2.companyName,t2.title,t2.department,t2.ext,t2.imageUrl, CONVERT(phoneLogId, UNSIGNED INTEGER) AS sortOrder FROM tb_phoneLog AS t1
LEFT JOIN tb_storedContacts AS t2 ON t1.phoneNumber = t2.phoneNumber AND t1.userId = t2.userId
WHERE t1.userId = 1
-- AND
-- TIMESTAMPDIFF(DAY, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) = 0

ORDER BY t1.callDate DESC