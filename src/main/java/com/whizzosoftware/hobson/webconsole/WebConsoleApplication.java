package com.whizzosoftware.hobson.webconsole;

import org.restlet.Application;
import org.restlet.Restlet;
import org.restlet.routing.Router;

public class WebConsoleApplication extends Application {
    @Override
    public Restlet createInboundRoot() {
        Router router = new Router();
        router.attach("/", new ClassLoaderOverrideDirectory(getContext(), "clap://class/", getClass().getClassLoader()));
        return router;
    }
}
