class HopperUtil{
	private function __construct(){}
	private function __clone(){}
	private static $__instance = NULL;
	public static function getInstance(){
		if(self::$__instance == NULL){
			if(self::$__instance == NULL) self::$__instance = new HopperUtil;
			return self::$__instance;
		}
		return self::$__instance;
	}

	public function test(){
		echo('test');
	}
}



	HopperUtil::getInstance()->test();