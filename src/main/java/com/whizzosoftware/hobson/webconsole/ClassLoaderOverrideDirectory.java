/*******************************************************************************
 * Copyright (c) 2014 Whizzo Software, LLC.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *******************************************************************************/
package com.whizzosoftware.hobson.webconsole;

import org.restlet.Context;
import org.restlet.resource.Directory;

/**
 * A Directory implementation that overrides the ClassLoader used for CLAP requests.
 *
 * @author Dan Noguerol
 */
public class ClassLoaderOverrideDirectory extends Directory {
    private ClassLoader bundleClassloader;

    public ClassLoaderOverrideDirectory(Context context, String rootUri, ClassLoader bundleClassloader) {
        super(context, rootUri);
        this.bundleClassloader = bundleClassloader;
    }

    public Context getContext() {
        // Get the context from the parent
        Context context = super.getContext();

        // Wrapper the context's client dispatcher in an object that will force it to use the OSGi bundle classloader
        // rather than the classloader that created the dispatcher. Also, the same Context object may run through
        // this many times so we have to make sure we don't wrapper multiple times -- otherwise evil hilarity will ensue
        // (i.e stack overflows)
        if (!(context.getClientDispatcher() instanceof CLAPCustomClassLoaderDispatcher)) {
            context.setClientDispatcher(new CLAPCustomClassLoaderDispatcher(context.getClientDispatcher(), bundleClassloader));
        }

        return context;
    }
}
