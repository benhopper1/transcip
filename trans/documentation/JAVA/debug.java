





@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Most compilers will eliminate the statement. For example:

public class Test {

    private static final boolean DEBUG = false;

    public static void main(String... args) {
    	if (DEBUG) {
    		System.out.println("Here I am");
    	}
    }

}
After compiling this class, I then print a listing of the produced instructions via the javap command:

javap -c Test
    Compiled from "Test.java"
    public class Test extends java.lang.Object{
    public Test();
      Code:
       0:   aload_0
       1:   invokespecial	#1; //Method java/lang/Object."":()V
       4:   return

    public static void main(java.lang.String[]);
      Code:
       0:   return

    }
As you can see, no System.out.println! :)
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
if ( Debug.isDebuggerConnected() ) {
  // debug stuff
}


