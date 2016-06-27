/*******************************************************************************
 * Copyright (c) 2016 Whizzo Software, LLC.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package com.whizzosoftware.hobson.webconsole;

import com.whizzosoftware.hobson.api.hub.HubWebApplication;
import com.whizzosoftware.hobson.api.plugin.AbstractHobsonPlugin;
import com.whizzosoftware.hobson.api.property.PropertyContainer;
import com.whizzosoftware.hobson.api.property.TypedProperty;

/**
 * A Hobson plugin that installs the default web console.
 *
 * @author Dan Noguerol
 */
public class WebConsolePlugin extends AbstractHobsonPlugin {
    public WebConsolePlugin(String pluginId) {
        super(pluginId);
    }

    @Override
    protected TypedProperty[] createSupportedProperties() {
        return null;
    }

    @Override
    public String getName() {
        return "Web Console Plugin";
    }

    @Override
    public void onPluginConfigurationUpdate(PropertyContainer config) {

    }

    @Override
    public void onStartup(PropertyContainer config) {
        getHubManager().getLocalManager().publishWebApplication(new HubWebApplication(WebConsoleApplication.PATH, WebConsoleApplication.class));
    }

    @Override
    public void onShutdown() {
        getHubManager().getLocalManager().unpublishWebApplication(WebConsoleApplication.PATH);
    }
}
