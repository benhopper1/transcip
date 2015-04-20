//Tip For testing you can allow network access in the main thread via the following snippet. at the beginning of your onCreate() method of your activity.

StrictMode.ThreadPolicy policy = new StrictMode.
ThreadPolicy.Builder().permitAll().build();
StrictMode.setThreadPolicy(policy); 
