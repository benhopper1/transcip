-- http://stackoverflow.com/questions/15626493/left-join-only-first-row
-- works-------

SELECT max(fc.path), cpc.* 
FROM tb_cachePhoneContacts AS cpc
LEFT JOIN tb_fileCache AS fc ON
cpc.photoUriString = hashCode_2
GROUP BY cpc.id

