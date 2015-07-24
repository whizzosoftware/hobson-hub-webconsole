package com.whizzosoftware.hobson.webconsole;

import org.restlet.Application;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.Restlet;
import org.restlet.data.Reference;
import org.restlet.routing.Router;

public class WebConsoleApplication extends Application {
    @Override
    public Restlet createInboundRoot() {
        Router router = new Router();
        router.attach("/", new ClassLoaderOverrideDirectory(getContext(), "clap://class/www/", getClass().getClassLoader()));
        return router;
    }

    @Override
    public void handle(Request request, Response response) {
        Reference ref = request.getResourceRef();
        if ("/console".equals(ref.getPath()) || "/console/".equals(ref.getPath())) {
            response.redirectPermanent("/console/index.html");
        } else {
            super.handle(request, response);
        }
    }
}
