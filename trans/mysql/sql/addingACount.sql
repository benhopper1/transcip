SELECT FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) AS entryDateTime, LEFT(callDate, 10) AS epochEntry,TIMESTAMPDIFF(WEEK, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS weeksOld,TIMESTAMPDIFF(DAY, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS daysOld,TIMESTAMPDIFF(MINUTE, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS minutesOld,TIMESTAMPDIFF(SECOND, FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)),NOW()) AS secondsOld,(DATE(FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) ) = CURDATE())AS today,(DATE(FROM_UNIXTIME(CONVERT(  LEFT(callDate , 10)   , UNSIGNED INTEGER)) ) = DATE_SUB(CURDATE(),INTERVAL 1 DAY))AS yesterday,t1.*,t2.name,t2.emailAddress,t2.companyName,t2.title,t2.department,t2.ext,t2.imageUrl, CONVERT(phoneLogId, UNSIGNED INTEGER) AS sortOrder FROM tb_phoneLog AS t1
LEFT JOIN tb_storedContacts AS t2 ON t1.phoneNumber = t2.phoneNumber AND t1.userId = t2.userId


	WHERE t1.userId = 1
	AND t1.status LIKE '%'
	ORDER BY t1.callDate DESC
LIMIT 20

