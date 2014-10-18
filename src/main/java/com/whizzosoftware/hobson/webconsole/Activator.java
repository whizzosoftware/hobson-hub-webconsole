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
import org.osgi.framework.ServiceReference;
import org.osgi.service.http.HttpService;
import org.osgi.util.tracker.ServiceTracker;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * The OSGi Activator class.
 *
 * @author Dan Noguerol
 */
public class Activator implements BundleActivator {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    private ServiceTracker tracker;
    private HttpService httpService;

    @Override
    public synchronized void start(BundleContext context) throws Exception {
        // add servlets for REST API
        tracker = new ServiceTracker(context, HttpService.class.getName(), null) {
            public static final String CONSOLE = "/console";
            public static final String ROOT = "/";

            @Override
            public Object addingService(ServiceReference serviceRef) {
                super.addingService(serviceRef);

                ServiceReference ref = context.getServiceReference(HttpService.class.getName());
                if (ref != null) {
                    httpService = (HttpService)context.getService(ref);
                    try {
                        // register the static resource context
                        httpService.registerResources(CONSOLE, ROOT, new StaticResourceContext());
                    } catch (Exception e) {
                        logger.error("Error registering servlets", e);
                    }
                    return httpService;
                } else {
                    return null;
                }
            }

            @Override
            public void removedService(ServiceReference ref, Object service) {
                super.removedService(ref, service);
            }
        };
        tracker.open();
    }

    @Override
    public synchronized void stop(BundleContext context) {
        tracker.close();
    }
}
