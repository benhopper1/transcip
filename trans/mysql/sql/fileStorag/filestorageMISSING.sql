SELECT t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage FROM tb_fileStorage AS t1 
LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

-- where t2.id is not NULL
------------------------------

SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s') AS fileAge, t1.createTime FROM tb_fileStorage AS t1 
LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

-- where t2.id is not NULL




------------------------------------------------------------------------
SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes, t1.createTime FROM tb_fileStorage AS t1 
LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

-- where t2.id is not NULL
---------------------------------------------------------------
select t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, if(t2.id is not null, true, false) as userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) as contactImage, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) as fileAgeMinutes, t1.createTime from tb_fileStorage as t1 
left join tb_user as t2 on
t1.domainPath = t2.screenImage

left join tb_storedContacts as t3 on 
t1.domainPath = t3.imageUrl

-- where t2.id is not NULL
----------------------------------------------
SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, IF(t4.id IS NOT NULL, TRUE, FALSE) AS fileCacheFile, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes, t1.createTime FROM tb_fileStorage AS t1

LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

LEFT JOIN tb_fileCache AS t4 ON 
t1.domainPath = t4.path

-ONLY DELETABLE ONES -------------------------------------------------------------------
SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, IF(t4.id IS NOT NULL, TRUE, FALSE) AS fileCacheFile, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes,t1.sizeBytes, t1.createTime FROM tb_fileStorage AS t1

LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

LEFT JOIN tb_fileCache AS t4 ON 
t1.domainPath = t4.path

WHERE 
t2.id IS NOT NULL
OR
t3.id IS NOT NULL
OR
t4.id IS NOT NULL

------- get sum of bytes for deletables ----------
SELECT grp1.groupKey, sum(grp1.sizeBytes) FROM 
(

SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, IF(t4.id IS NOT NULL, TRUE, FALSE) AS fileCacheFile, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes,t1.sizeBytes, t1.createTime FROM tb_fileStorage AS t1

LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

LEFT JOIN tb_fileCache AS t4 ON 
t1.domainPath = t4.path

WHERE 
t2.id IS NOT NULL
OR
t3.id IS NOT NULL
OR
t4.id IS NOT NULL
) AS grp1
GROUP BY grp1.groupKey



--- get sum of all files -------
SELECT grp1.groupKey, sum(grp1.sizeBytes) FROM 
(
	SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, IF(t4.id IS NOT NULL, TRUE, FALSE) AS fileCacheFile, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes,t1.sizeBytes, t1.createTime FROM tb_fileStorage AS t1

	LEFT JOIN tb_user AS t2 ON
	t1.domainPath = t2.screenImage

	LEFT JOIN tb_storedContacts AS t3 ON 
	t1.domainPath = t3.imageUrl

	LEFT JOIN tb_fileCache AS t4 ON 
	t1.domainPath = t4.path
) AS grp1
GROUP BY grp1.groupKey


get deleteables----------------------------------------------------------------------
SELECT t1.groupKey, t1.storageKey, t1.domainPath, t1.serverPath, IF(t2.id IS NOT NULL, TRUE, FALSE) AS userImage, IF(t3.id IS NOT NULL, TRUE, FALSE) AS contactImage, IF(t4.id IS NOT NULL, TRUE, FALSE) AS fileCacheFile, TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) AS fileAgeMinutes,t1.sizeBytes, t1.createTime FROM tb_fileStorage AS t1

LEFT JOIN tb_user AS t2 ON
t1.domainPath = t2.screenImage

LEFT JOIN tb_storedContacts AS t3 ON 
t1.domainPath = t3.imageUrl

LEFT JOIN tb_fileCache AS t4 ON 
t1.domainPath = t4.path

WHERE 
(
t2.id IS NOT NULL
OR
t3.id IS NOT NULL
OR
t4.id IS NOT NULL
)
AND
t1.groupKey LIKE '%'
AND
TIMESTAMPDIFF(MINUTE, STR_TO_DATE(t1.createTime, '%Y-%m-%d %H:%i:%s'), now()) > '430'
and
t1.storageKey like '%'
limit 0