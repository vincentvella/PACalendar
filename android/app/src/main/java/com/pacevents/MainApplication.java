package com.pacevents;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.geektime.rnonesignalandroid.ReactNativeOneSignalPackage;
import com.microsoft.codepush.react.CodePush;
import com.oblador.vectoricons.VectorIconsPackage;
import com.react.rnspinkit.RNSpinkitPackage;
import com.swmansion.rnscreens.RNScreensPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.vonovak.AddCalendarEventPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
        return CodePush.getJSBundleFile();
        }
    
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            mCallbackManager = new CallbackManager.Factory().create();
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ReactNativeOneSignalPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY_ANDROID, MainApplication.this, BuildConfig.DEBUG),
                    new VectorIconsPackage(),
                    new RNScreensPackage(),
                    new RNGoogleSigninPackage(),
                    new ReactNativeConfigPackage(),
                    new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
                    new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
                    new AppCenterReactNativePackage(MainApplication.this),
                    new RNGestureHandlerPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RNSpinkitPackage(),
                    new AddCalendarEventPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        AppEventsLogger.activateApp(this);
        SoLoader.init(this, /* native exopackage */ false);
    }
}
