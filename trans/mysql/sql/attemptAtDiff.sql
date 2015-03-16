SELECT t1.*, CONCAT(t1.name, t1.type) AS compKey FROM tb_cachePhoneContacts AS t1
WHERE CONCAT(t1.name, t1.type) NOT IN (SELECT cONCAT(t2.name, t2.type) AS compKey FROM tb_storedContacts AS t2)

