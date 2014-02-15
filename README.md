Transform
=========

Transform is a JS library that rearranges elements in one document to form
another. The simplest explanation is to picture the letters in an anagram
physically rearranging themselves to switch between the two phrases.

See an example at: http://www.cs.princeton.edu/~edwardz/transform.html

Transform is general enough to work with any spatial arrangement
of individual entities, as long as those entities have some notion
of similarity/equality. For example, in text documents we can arrange
characters and words; in 2d images we can look at image patches based
on color or edges; in 3d we can think of individual lego bricks making
up a model.

Transform is currently under development, and is focused on manipulating 
HTML DOM elements, i.e. textual animation.

Currently Transform is just a visual experiment.
Future applications of questionable importance:
- Cheesy slideshow transitions
- An anagram animation <small>anemoneanemoneanemone</small>
- Movie sequence where protagonist decodes urgent secret message
- Visually attractive but cryptographically insecure steganography

TODOs
-----
Core Functionality:
- Handle unmatched characters in both documents
- Handle non-text display elements
    - Fade in and out as appropriate
    - Manually add match?
- Make it easy to pick up and use

Matching Functionality:
- Implement similar character matching and transitions
    - Implement max-weight bipartite matching
- Implement position-based matching
   - Implement flow-field matching

Animation:
    - Explosion (2d and 3d)
    - Add 3d effect to linear
    - Flow field transition
    - Swirling transition
    - Flipping, rotating, resizing
    - 3D paths

Other:
- Load testing: How many animated spans can browsers handle?

Extensions:
- Word Parser
- Extend to canvas
    - Image patches
    - 3D blocks
