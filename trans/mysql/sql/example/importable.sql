SELECT 
IF(t1.imageUrl IS NOT NULL, FALSE, TRUE) AS needCached,
IF(t2.id IS NOT NULL, FALSE, TRUE) AS isImportable,
t1.compkey  AS compkey,
t1.imageUrl AS pc_imageUrl,
t1.id AS pc_id,
t1.name AS pc_name,
t1.phoneNumber AS pc_phoneNumber,
t1.emailAddress AS pc_emailAddress,
t1.companyName AS pc_companyName,
t1.department AS pc_department,
t1.title AS pc_title,
t1.userId AS pc_userId,
t1.ext AS pc_ext,
t1.type AS pc_type,
t1.photoUriString AS pc_photoUriString,
t1.rawContactId AS pc_rawContactId,
t1.contactId AS pc_contactId,
t1.entryDate AS pc_entryDate,
t2.id AS sc_id,
t2.name AS sc_name,
t2.phoneNumber AS sc_phoneNumber,
t2.emailAddress AS sc_emailAddress,
t2.companyName AS sc_companyName,
t2.department AS sc_department,
t2.title AS sc_title,
t2.imageUrl AS sc_imageUrl,
t2.entryTimeStamp AS sc_entryTimeStamp,
t2.refNumber AS sc_refNumber,
t2.userId AS sc_userId,
t2.ext AS sc_ext,
t2.type AS sc_type
-- hhhhhh
FROM vw_phoneCache_file_cache AS t1 
LEFT JOIN tb_storedContacts AS t2 ON
t1.name = t2.name
AND
t1.type = t2.type
AND
t1.userId = t2.userId

WHERE t1.userId = 388
