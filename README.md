# Interactive-B-zier-Rope-web
Overview<br>
This project simulates a cubic Bézier curve where the internal control points ($P_1, P_2$) react to user input using spring-mass-damper physics.<br><br>
<b>Math Implementation</b>
<ul>Curve: The curve is generated using the explicit cubic Bézier formula:<br> $B(t) = (1-t)&sup3P_0 + 3(1-t)&sup2tP_1 + 3(1-t)t&sup2P_2 + t&sup3P_3$</ul>
<ul>Tangents: Tangents are visualized by calculating the first derivative $B'(t)$ at sampled intervals, normalizing the resulting vector, and drawing a line segment in that direction.</ul><br>
Physics Model The dynamic control points follow the mouse cursor using a physics calculation updated every frame:<br>
<ul>$$Acceleration = -k \cdot (Position - Target) - c \cdot Velocity$$</ul><br>
Where $k$ is the stiffness coefficient and $c$ is the damping factor. This creates a "rubbery" or "rope-like" behavior as the points overshoot the target and settle.
