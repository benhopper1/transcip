-- vw_smsRead
SELECT DISTINCT CONVERT(t3.smsId, UNSIGNED INTEGER) as sortOrder, vw_activeUser.fullName as userName, vw_activeUser.screenImage, t3.name as contactName, t3.imageUrl,t3.smsId,t3.contactName as smsName,t3.contactPhoneNumber as smsPhoneNumber,t3.date,t3.dateSent,t3.thread,t3.read,  t3.smsContext,t3.userId,t3.body from 
vw_sub_smsRead_3 as t3 

left join vw_activeUser ON t3.userId = vw_activeUser.id WHERE userId = 484 AND contactPhoneNumber = '12562223333' ORDER BY sortOrder desc LIMIT 125 




//-------------------------------------------------------

SELECT DISTINCT t1.smsId,t1.contactName,t1.contactPhoneNumber AS smsPhoneNumber, t1.date, t1.dateSent ,t1.thread,t1.read,t1.smsContext,t1.userId,t1.body,
t2.imageUrl, t2.name AS smsName,
concat(t3.fName, ' ', t3.lName) AS userName, t3.screenImage,
CONVERT(smsId, UNSIGNED INTEGER) AS sortOrder FROM tb_smsStore AS t1

LEFT JOIN tb_storedContacts AS t2 ON
t1.userId = t2.userId
AND
t1.contactphonenumber=t2.phoneNumber

LEFT JOIN tb_user AS t3 ON
t1.userId = t3.id


WHERE 
t1.userId = 484 AND 
t1.contactPhoneNumber='12566066202'
ORDER BY sortOrder DESC LIMIT 125