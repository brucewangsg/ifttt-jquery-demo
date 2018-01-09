# IFTTT Applet Selector Demo

This is an attempt to create an applet that shows selection of services as a trigger. If the trigger is satisfied, it will lead to the execution of an action specified by users. In this demo, we will only try to implement the applet UI.

## The Approach

This is the wireframe to illustrate what we want to achieve [`Wireframe`](https://wireframeapp.io/app/preview/1a428501)

In this attempt, I used a simple jQuery app to handle all the user interactions, events, display. The layout, look and feel was done up with the help of Twitter bootstrap CSS.

To keep track of states, I used a simple KVO listener that handle callbacks when the state have change.

## Demo

Check out [the demo here](http://ifttt-jquery-demo.actionnn.com/)

## Conclusion

Utilizing jQuery alone to create an UI can be pretty messy. This is just a simple exercise. Imagine if we have something a lot more complicated. Too many lines of code were written to find the corresponding node to update the content and display state (using jQuery selector). Moving forward, we should really use frameworks such as [EmberJS](https://www.emberjs.com), [VueJS](https://vuejs.org) or [ReactJS](https://reactjs.org).
 