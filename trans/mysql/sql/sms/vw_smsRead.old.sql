-- vw_smsRead
SELECT DISTINCT CONVERT(t3.smsId, UNSIGNED INTEGER) as sortOrder, vw_activeUser.fullName as userName, vw_activeUser.screenImage, t3.name as contactName, t3.imageUrl,t3.smsId,t3.contactName as smsName,t3.contactPhoneNumber as smsPhoneNumber,t3.date,t3.dateSent,t3.thread,t3.read,  t3.smsContext,t3.userId,t3.body from 
(select t2.name, t2.imageUrl, tb_smsStore.* from tb_smsStore LEFT JOIN 
( SELECT userId, phoneNumber, max(tb_storedContacts.name) as 'name', max(tb_storedContacts.imageUrl) AS imageUrl FROM tb_storedContacts GROUP BY phoneNumber ) as t2  --vw_sub_smsRead_2



ON tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber and tb_smsStore.userId = t2.userId WHERE tb_smsStore.smsContext = 'inbox' UNION ALL SELECT t2.name, t2.imageUrl, tb_smsStore.* FROM tb_smsStore LEFT JOIN 
( SELECT userId, phoneNumber, max(tb_storedContacts.name) as 'name' , max(tb_storedContacts.imageUrl) as imageUrl FROM tb_storedContacts GROUP BY phoneNumber ) AS t2 ON tb_smsStore.cleanContactPhoneNumber = t2.phoneNumber AND tb_smsStore.userId = t2.userId WHERE tb_smsStore.smsContext = 'sent' ) t3 


left join vw_activeUser ON t3.userId = vw_activeUser.id WHERE userId = 484 AND contactPhoneNumber = '12562223333' ORDER BY sortOrder desc LIMIT 125 