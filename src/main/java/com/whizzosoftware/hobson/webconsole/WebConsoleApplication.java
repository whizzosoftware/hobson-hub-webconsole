/*******************************************************************************
 * Copyright (c) 2016 Whizzo Software, LLC.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package com.whizzosoftware.hobson.webconsole;

import org.restlet.Application;
import org.restlet.Request;
import org.restlet.Response;
import org.restlet.Restlet;
import org.restlet.data.Reference;
import org.restlet.routing.Router;

/**
 * A Restlet application for the default web console.
 *
 * @author Dan Noguerol
 */
public class WebConsoleApplication extends Application {
    public static final String PATH = "/console";

    @Override
    public Restlet createInboundRoot() {
        Router router = new Router();
        router.attach("/", new ClassLoaderOverrideDirectory(getContext(), "clap://class/www/", getClass().getClassLoader()));
        return router;
    }

    @Override
    public void handle(Request request, Response response) {
        Reference ref = request.getResourceRef();
        if (PATH.equals(ref.getPath()) || (PATH + "/").equals(ref.getPath())) {
            response.redirectPermanent(PATH + "/index.html");
        } else {
            super.handle(request, response);
        }
    }
}
