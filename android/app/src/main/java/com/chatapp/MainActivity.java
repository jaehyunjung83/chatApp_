package com.chatapp;

import android.app.Activity;
import android.content.Intent;
import android.os.Build;

import com.facebook.react.ReactActivity;

import android.content.Intent;


public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "chatApp";
  }

  @Override
  public void onNewIntent(Intent intent) {
        
    super.onNewIntent(intent);

  }


}

