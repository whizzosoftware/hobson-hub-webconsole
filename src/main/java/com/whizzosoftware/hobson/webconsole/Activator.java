/*******************************************************************************
 * Copyright (c) 2014 Whizzo Software, LLC.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package com.whizzosoftware.hobson.webconsole;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.restlet.Application;

import java.util.Dictionary;
import java.util.Hashtable;

/**
 * The OSGi Activator class.
 *
 * @author Dan Noguerol
 */
public class Activator implements BundleActivator {
    @Override
    public synchronized void start(BundleContext context) throws Exception {
        // add Restlet application for web console
        Dictionary props = new Hashtable();
        props.put("path", "/console");
        context.registerService(Application.class.getName(), new WebConsoleApplication(), props);
    }

    @Override
    public synchronized void stop(BundleContext context) {
    }
}
