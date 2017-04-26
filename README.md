PicoGL.js
========

PicoGL.js is minimal WebGL 2-only rendering library. It's meant for developers who understand the WebGL 2 rendering pipeline and want to use it, but with a more convenient API. Typical usage of PicoGL.js will involve creating programs, array buffers, vertex arrays, uniform buffers, framebuffers, textures, transform feedbacks, and combining them into draw calls.

```JavaScript
    var app = PicoGL.createApp(canvas)
    .clearColor(0.0, 0.0, 0.0, 1.0);

    var program = app.createProgram(vertexShaderSource, fragmentShaderSource);

    var positions = app.createArrayBuffer(PicoGL.FLOAT, 2, new Float32Array([
        -0.5, -0.5,
         0.5, -0.5,
         0.0,  0.5
    ]));

    var vertexArray = app.createVertexArray()
    .attributeBuffer(0, positions);

    var uniformBuffer = app.createUniformBuffer([
        PicoGL.FLOAT_VEC4,
        PicoGL.FLOAT_VEC4
    ])
    .set(0, new Float32Array([1.0, 0.0, 0.0, 0.3]))
    .set(1, new Float32Array([0.0, 0.0, 1.0, 0.7]))
    .update();

    var drawCall = app.createDrawCall(program, vertexArray)
    .uniformBlock("ColorUniforms", uniformBuffer);

    app.drawCalls([drawCall])
    .clear()
    .draw();

``` 


Note that PicoGL.js is **not** a scene graph library. There are no objects, hierarchies, transforms, materials, etc. It has been designed only to make management of GPU state more convenient. Its conceptual model maps fairly directly to the constructs one deals with when writing directly with WebGL. The only higher-level construct is the **draw call**, which manages sets of related lower-level constructs. 

PicoGL.js simplifies usage of some more complex WebGL 2 features, such as multiple render targets, uniform buffers and transform feedback.

Multiple Render Targets
-----------------------

```JavaScript
    var app = PicoGL.createApp(canvas)
    .clearColor(0.0, 0.0, 0.0, 1.0)
    .floatRenderTargets();  // EXT_color_buffer_float 

    var framebuffer = app.createFramebuffer()
    .colorTarget(0, PicoGL.FLOAT)
    .colorTarget(1, PicoGL.FLOAT)
    .depthTarget();
    
    // ... set up programs and vertex arrays for offscreen and
    // main draw passes...

    var offscreenDrawCall = app.createDrawCall(offscreenProgram, offscreenVAO);

    // Bind main program texture samplers to framebuffer targets
    var mainDrawCall = app.createDrawCall(mainProgram, mainVAO)
    .texture("texture1", frameBuffer.colorTexture[0])
    .texture("texture2", frameBuffer.colorTexture[1])
    .texture("depthTexture", frameBuffer.depthTexture);

    // Offscreen pass
    app.framebuffer(framebuffer)
    .drawCalls([offscreenDrawCall])
    .clear()
    .draw()
    // Main draw pass
    .defaultFramebuffer()
    .drawCalls([mainDrawCall])
    .clear()
    .draw();
```

Uniform Buffers
---------------

```JavaScript
    var app = PicoGL.createApp(canvas)
    .clearColor(0.0, 0.0, 0.0, 1.0);
    
    // ... set up program and vertex array...

    // Layout is std140
    var uniformBuffer = app.createUniformBuffer([
        PicoGL.FLOAT_MAT4,
        PicoGL.FLOAT_VEC4,
        PicoGL.INT_VEC4,
        PicoGL.FLOAT
    ])
    .set(0, matrix)
    .set(1, float32Vector)
    .set(2, int32Vector)
    .set(3, scalar)
    .update();      // Data only sent to GPU when update() is called.

    var drawCall = app.createDrawCall(program, vertexArray)
    .uniformBlock("UniformBlock", uniformBuffer);
```

Transform Feedback
------------------

```JavaScript
    var app = PicoGL.createApp(canvas)
    .clearColor(0.0, 0.0, 0.0, 1.0);

    // Last argument is transform feedback varyings.
    var program = app.createProgram(vertexShaderSource, fragmentShaderSource, ["vPosition"]);

    var positions1 = app.createArrayBuffer(PicoGL.FLOAT, 2, new Float32Array(6));
    var vertexArray1 = app.createVertexArray()
    .attributeBuffer(0, positions1);

    var positions2 = app.createArrayBuffer(PicoGL.FLOAT, 2, new Float32Array(6));
    var vertexArray2 = app.createVertexArray()
    .attributeBuffer(0, positions2);

    // Last argument indices of buffers in the vertex arrays that will be used
    // for transform feedback
    var transformFeedback = app.createTransformFeedback(vertexArray1, vertexArray2, [0]);

    var drawCall = app.createDrawCall(program, transformFeedback);

    app.drawCalls([drawCall])
    .clear()
    .draw();

    // Swap input and output buffers
    transformFeedback.swapBuffers();
``` 
