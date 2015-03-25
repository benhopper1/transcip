SELECT t1.userId, t1.itemType, t1.orderId, t2.productId, t2.isOwned, t2.isOverRideOwned, t1.purchaseTime, 
t1.purchaseState,t2.productType, t2.title, t2.description, t2.price, t3.imageUrl, t3.youtube, t3.isBuyEnabled, t3.daysValidPeriod, t1.packageName
FROM
tb_purchases AS t1 LEFT OUTER JOIN tb_products AS t2
ON t1.productId = t2.productId

LEFT JOIN tb_showCaseProduct AS t3
ON t1.productId = t3.productId
WHERE t2.isOwned = 'true'
AND
t1.packageName LIKE '%'
AND
t1.itemType LIKE '%' 
