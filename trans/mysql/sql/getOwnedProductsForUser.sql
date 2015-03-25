-- to use overRide must add record to purchase also.....

SELECT t1.itemType, t2.productId, t1.purchaseTime, 
t1.purchaseState, t3.isBuyEnabled, t3.daysValidPeriod, t1.packageName
FROM
tb_purchases AS t1 LEFT OUTER JOIN tb_products AS t2
ON t1.productId = t2.productId

LEFT JOIN tb_showCaseProduct AS t3
ON t1.productId = t3.productId AND t1.userId = t2.userId
WHERE (t2.isOwned = 'true' OR t2.isOverRideOwned = 'true')
AND
t1.packageName LIKE '%'
AND
t1.itemType LIKE '%'
AND
t1.userId = 389 
