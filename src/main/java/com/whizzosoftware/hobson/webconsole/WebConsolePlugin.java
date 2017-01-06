/*
 *******************************************************************************
 * Copyright (c) 2016 Whizzo Software, LLC.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************
*/
package com.whizzosoftware.hobson.webconsole;

import com.whizzosoftware.hobson.api.hub.HubConfigurationClass;
import com.whizzosoftware.hobson.api.hub.HubContext;
import com.whizzosoftware.hobson.api.hub.HubWebApplication;
import com.whizzosoftware.hobson.api.plugin.AbstractHobsonPlugin;
import com.whizzosoftware.hobson.api.plugin.PluginType;
import com.whizzosoftware.hobson.api.property.PropertyContainer;
import com.whizzosoftware.hobson.api.property.TypedProperty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.awt.*;
import java.net.URI;

/**
 * A Hobson plugin that installs the default web console.
 *
 * @author Dan Noguerol
 */
public class WebConsolePlugin extends AbstractHobsonPlugin {
    private Logger logger = LoggerFactory.getLogger(WebConsolePlugin.class);

    public WebConsolePlugin(String pluginId, String version, String description) {
        super(pluginId, version, description);
    }

    @Override
    protected TypedProperty[] getConfigurationPropertyTypes() {
        return null;
    }

    @Override
    public String getName() {
        return "Web Console Plugin";
    }

    @Override
    public PluginType getType() {
        return PluginType.CORE;
    }

    @Override
    public void onStartup(PropertyContainer config) {
        getHubManager().getLocalManager().publishWebApplication(new HubWebApplication(WebConsoleApplication.PATH, WebConsoleApplication.class));

        // determine web app URL prefix
        PropertyContainer pc = getHubManager().getHub(HubContext.createLocal()).getConfiguration();
        if (pc.getBooleanPropertyValue(HubConfigurationClass.SETUP_COMPLETE)) {
            String consoleURI = pc.getBooleanPropertyValue(HubConfigurationClass.SSL_MODE) ? "https://localhost:8183/console/index.html" : "http://localhost:8182/console/index.html";

            // launch a browser
            try {
                if (Desktop.isDesktopSupported()) {
                    Desktop.getDesktop().browse(new URI(consoleURI));
                }
            } catch (Throwable t) {
                logger.warn("Unable to launch web browser", t);
            }

            System.out.println("Hobson is now available at " + consoleURI);
        }
    }

    @Override
    public void onShutdown() {
        getHubManager().getLocalManager().unpublishWebApplication(WebConsoleApplication.PATH);
    }
}
