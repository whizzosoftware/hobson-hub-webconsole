/*******************************************************************************
 * Copyright (c) 2014 Whizzo Software, LLC.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package com.whizzosoftware.hobson.webconsole;

import org.osgi.service.http.HttpContext;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URL;

/**
 * An HttpContext that exposes static resources.
 *
 * @author Dan Noguerol
 */
public class StaticResourceContext implements HttpContext {
    @Override
    public boolean handleSecurity(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) throws IOException {
        return true;
    }

    @Override
    public URL getResource(String s) {
        if ("/".equals(s)) {
            s = "www/root-redirect.html";
        }
        return getClass().getClassLoader().getResource(s);
    }

    @Override
    public String getMimeType(String s) {
        return null;
    }
}
