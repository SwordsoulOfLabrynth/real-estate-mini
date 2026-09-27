# Real Estate Intelligence Map

## Product Requirements Document (PRD)

**Version:** 1.0
**Platform:** Web Application
**Primary Stack:** Next.js + Supabase
**Map:** Leaflet + OpenStreetMap
**Target:** Desktop-first responsive web application

---

# 1. Product Overview

## 1.1 Product Name

**Real Estate Intelligence Map**

A location-first real estate platform that allows users to discover properties, understand neighborhood conditions, compare property values, and analyze accessibility through an interactive map.

The product should NOT feel like a conventional property listing website.

The core experience is:

> **“Understand the place before choosing the property.”**

Instead of presenting a long list of property cards, the map is the primary interface and property listings, neighborhood data, facilities, pricing information, and area analysis are connected to the map.

---

# 2. Problem

Traditional real-estate listing websites usually focus on:

* Property photos
* Price
* Bedrooms
* Property descriptions
* Contact information

However, users also need to understand:

* Where the property actually is
* What exists around the property
* How accessible the area is
* How the property's price compares with nearby properties
* Whether the asking price is relatively high or low
* Nearby schools, hospitals, markets and transportation
* Neighborhood characteristics

Users currently need to gather this information from multiple sources.

This product combines property discovery and geographic intelligence into one map-centric experience.

---

# 3. Product Goals

## Primary Goals

1. Allow users to discover real-estate properties geographically.
2. Allow users to filter properties based on meaningful criteria.
3. Allow users to inspect the neighborhood surrounding a property.
4. Provide price-per-square-foot information.
5. Provide nearby facility information.
6. Provide area-level statistics.
7. Provide map-based visualization of property pricing and density.
8. Provide a useful and visually distinctive experience rather than a generic AI-generated dashboard.

## Secondary Goals

* Allow users to compare properties.
* Allow users to save/favorite properties.
* Allow users to view property details.
* Allow users to switch between different map intelligence layers.
* Provide a foundation for future price-trend analytics.

---

# 4. Non-Goals

Version 1 should NOT attempt to implement:

* Real-estate transactions
* Online payment
* Escrow
* Mortgage processing
* Legal property verification
* Automated property valuation using ML
* Complex AI chatbot functionality
* Full CRM functionality
* Property rental contract management

The product should focus on **discovery + geographic intelligence + analytics**.

---

# 5. Target Users

## Primary User

A person searching for:

* A house
* Apartment
* Condo
* Land
* Rental property

The user wants to understand both the property and its surrounding area.

## Secondary User

Real-estate agents who want to:

* Display properties
* Understand local pricing
* Analyze neighborhoods
* Share property locations with clients

---

# 6. Core Product Concept

The application consists of five connected layers:

```text
                    REAL ESTATE
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Properties       Neighborhood       Analytics
        │                │                │
   Buy / Rent       Facilities       Price/sqft
        │                │                │
        └────────────────┼────────────────┘
                         │
                    INTERACTIVE MAP
                         │
                   Smart Discovery
```

The map should be the visual center of the application.

---

# 7. Main Features

## 7.1 Interactive Property Map

The main screen should display properties as map markers.

Each property marker should communicate basic information without requiring the user to open a full property page.

Possible marker format:

```text
180M
```

or

```text
90K/sqft
```

Avoid generic pin icons whenever possible.

Different property states can have subtle visual distinctions.

Users can:

* Pan the map
* Zoom
* Select markers
* Cluster markers when zoomed out
* Open property previews
* Search locations
* Apply filters

---

# 8. Property Search

Users should be able to search by:

* Township
* Neighborhood
* Street
* Landmark
* Property name/listing title

Search should support autocomplete where practical.

Example:

```text
Search location or property...
```

---

# 9. Property Filters

Filters should include:

### Listing Type

* For Sale
* For Rent

### Property Type

* House
* Apartment
* Condo
* Land

### Price

Minimum / Maximum

### Area

Minimum / Maximum sqft

### Bedrooms

* 1
* 2
* 3
* 4+

### Bathrooms

* 1
* 2
* 3+

### Additional Features

* Parking
* Furnished
* Garden
* Balcony
* Security

Filters should update map results without requiring a full page reload.

---

# 10. Property Preview

Clicking a property marker should open a compact preview.

Example information:

```text
┌───────────────────────────────┐
│ PROPERTY IMAGE                │
│                               │
│ 3 Bedroom House               │
│ Chanmyathazi                  │
│                               │
│ 180,000,000 MMK               │
│ 2,000 sqft                    │
│ 3 Beds · 2 Baths              │
│                               │
│ 82K MMK / sqft                │
│                               │
│ [View Property]               │
└───────────────────────────────┘
```

The preview should not become an oversized floating card covering the map.

---

# 11. Property Details

The property details page should include:

## Property Information

* Title
* Price
* Listing type
* Property type
* Area
* Bedrooms
* Bathrooms
* Parking
* Description
* Images
* Location

## Location Intelligence

Display:

* Nearby schools
* Hospitals
* Markets
* Banks
* Bus stops
* Parks
* Other useful facilities

## Price Intelligence

Show:

* Price per sqft
* Nearby property price comparison
* Local average price/sqft

Important:

Price analytics must clearly indicate whether values are:

* Actual listing data
* Calculated values
* User-provided information
* Estimates

Do not present estimates as authoritative market values.

---

# 12. Neighborhood Analysis

Users should be able to analyze an area around a selected property.

Example:

```text
AREA ANALYSIS

Average listing price
165M MMK

Average price / sqft
82K MMK

Properties
124

Schools
7

Hospitals
3

Markets
11
```

The analysis radius should be configurable.

Example:

```text
500 m
1 km
2 km
5 km
```

---

# 13. Map Layers

The user should be able to toggle map layers.

```text
MAP LAYERS

☑ Properties
☐ Schools
☐ Hospitals
☐ Markets
☐ Banks
☐ Bus Stops
☐ Parks
☐ Price Heatmap
☐ Property Density
```

Layers should not visually overwhelm each other.

Only the selected intelligence layer should receive strong visual emphasis.

---

# 14. Price Heatmap

The application should provide a price visualization layer.

Possible metrics:

* Average listing price
* Price per sqft
* Rental price
* Property density

The visualization should communicate geographic patterns rather than simply adding colored blobs to the map.

---

# 15. Price Per Square Foot

For properties where both price and area are available:

```text
price_per_sqft = property_price / property_area
```

Example:

```text
Price: 180,000,000 MMK
Area: 2,000 sqft

Price/sqft:
90,000 MMK
```

The application should use consistent formatting.

---

# 16. Property Comparison

Users can select multiple properties and compare them.

Example:

|                      | Property A | Property B | Property C |
| -------------------- | ---------: | ---------: | ---------: |
| Price                |       180M |       165M |       195M |
| Area                 | 2,000 sqft | 2,200 sqft | 1,900 sqft |
| Beds                 |          3 |          3 |          4 |
| Price/sqft           |        90K |        75K |       103K |
| Distance to hospital |     1.2 km |     0.8 km |     2.1 km |

Comparison should focus on factual differences.

---

# 17. Smart Property Discovery

Users should be able to define requirements:

```text
Budget:
150M – 200M

Property:
House

Bedrooms:
3+

Maximum distance:
5 km from selected location
```

The system then filters matching properties.

Future versions may introduce recommendation algorithms.

Version 1 should use transparent filtering rather than unexplained AI recommendations.

---

# 18. Location Intelligence

For a selected property, calculate/display:

* Distance to nearby facilities
* Number of facilities within radius
* Property density
* Average local listing price
* Average price/sqft
* Number of properties for sale
* Number of properties for rent

---

# 19. Favorites

Users can save properties.

Features:

* Add favorite
* Remove favorite
* Favorites page
* Compare favorites

Authentication should be required only when necessary.

Browsing properties should not require authentication.

---

# 20. Data Model

Supabase PostgreSQL should be used.

## properties

Suggested fields:

```text
id
title
description
listing_type
property_type
price
currency
area_sqft
bedrooms
bathrooms
parking
latitude
longitude
address
township
city
images
created_at
updated_at
status
```

## facilities

```text
id
name
type
latitude
longitude
address
created_at
```

Facility types:

```text
school
hospital
market
bank
bus_stop
park
```

## favorites

```text
id
user_id
property_id
created_at
```

## profiles

```text
id
email
display_name
avatar_url
created_at
```

---

# 21. Geospatial Data

Use PostgreSQL/PostGIS where appropriate.

Property and facility coordinates should be stored as geographic points.

The system should support:

* Radius queries
* Distance calculations
* Nearby facility searches
* Bounding-box queries
* Map viewport-based property retrieval

Do not load every property into the browser if the dataset becomes large.

Query properties based on the current map viewport.

---

# 22. Technical Stack

## Frontend

**Next.js**

Recommended:

* App Router
* TypeScript
* Server Components where appropriate
* Client Components only when interactivity requires them

## Styling

Use a consistent design system.

Possible implementation:

* Tailwind CSS
* CSS variables
* Custom reusable components

Do NOT rely on a large prebuilt component library for the entire visual identity.

## Backend

**Supabase**

Use:

* PostgreSQL
* PostGIS where available
* Supabase Auth
* Supabase Storage
* Row Level Security
* Supabase Realtime only where actually useful

## Map

**Leaflet + OpenStreetMap**

Avoid Google Maps APIs unless explicitly required.

## Icons

Use one consistent icon family.

Do not mix multiple unrelated icon styles.

---

# 23. UI / UX Design Direction

## Core Design Principle

The product must feel like a **professional location-intelligence product**, not an AI-generated SaaS template.

The design should communicate:

* Geographic intelligence
* Trust
* Precision
* Exploration
* Real estate
* Data

It should feel designed intentionally rather than assembled from UI components.

---

# 24. Anti-AI-Slop Design Requirements

This section is mandatory.

The implementation must NOT blindly follow common AI-generated UI patterns.

## Avoid excessive shadows

Do NOT:

* Put heavy `box-shadow` on every card
* Create floating cards everywhere
* Use multiple layers of shadows
* Use exaggerated glassmorphism

Cards should generally use:

* spacing
* borders
* subtle background differences
* typography
* hierarchy

rather than large shadows.

---

## Avoid excessive rounded corners

Do NOT give every element huge rounded corners.

Avoid patterns such as:

```text
rounded-full
rounded-3xl
```

everywhere.

Use different corner radii intentionally according to component hierarchy.

For example:

* Small controls → subtle radius
* Cards → moderate radius
* Pills → reserved for actual tags/statuses

---

# 25. Typography Requirements

Typography must have hierarchy.

Do NOT use one font size/weight for everything.

Example hierarchy:

```text
Display / page title
Section heading
Card title
Body
Secondary information
Metadata
Caption
```

Use typography to establish hierarchy instead of relying on cards and shadows.

Do not use excessively bold text everywhere.

Do not use giant gradient headings simply because they are common in AI-generated landing pages.

---

# 26. Color System

Do not use a random color palette.

Define a semantic color system:

```text
Background
Surface
Surface elevated
Primary
Primary subtle
Text
Text secondary
Border
Success
Warning
Danger
Map accent
```

Colors should have functional meaning.

The map should remain visually dominant.

UI colors must not compete with geographic information.

---

# 27. Avoid Generic AI SaaS Aesthetics

The following patterns should NOT be used unless there is a strong UX reason:

* Purple/blue AI gradients
* Huge centered hero text
* “The future of real estate” marketing copy
* Excessive glassmorphism
* Floating blobs
* Random decorative gradients
* Excessive pill buttons
* Excessive emoji usage
* Dashboard cards everywhere
* Huge rounded containers
* Everything centered
* Generic “AI-powered” badges
* Fake statistics
* Fake testimonials
* Stock-style decorative illustrations
* Unnecessary animations

---

# 28. Visual Identity

The application should have a recognizable visual language.

Possible design direction:

**Editorial cartography + modern real-estate intelligence**

Combine:

* Clean map interface
* Strong typography
* Restrained neutral surfaces
* One distinctive accent color
* Data-oriented visual hierarchy
* Fine borders
* Subtle separators
* Carefully designed property markers

The interface should feel closer to a professional mapping/data product than a generic startup dashboard.

---

# 29. Layout Principles

The map should occupy the majority of the primary workspace.

Recommended desktop structure:

```text
┌─────────────────────────────────────────────────────┐
│ Header / Search                                     │
├───────────────┬─────────────────────────────────────┤
│               │                                     │
│ Filters       │                                     │
│               │                                     │
│ Property      │              MAP                    │
│ Results       │                                     │
│               │                                     │
│               │                                     │
├───────────────┴─────────────────────────────────────┤
│ Optional contextual information                     │
└─────────────────────────────────────────────────────┘
```

Do not cover the map with unnecessary UI.

---

# 30. Responsive Design

Desktop is the primary experience.

Mobile must remain usable.

On mobile:

```text
Map
 ↓
Bottom sheet
 ↓
Property details
```

Avoid trying to reproduce the entire desktop sidebar on a small screen.

---

# 31. Animation

Animation should communicate state or spatial relationships.

Good uses:

* Marker selection
* Map movement transitions
* Filter changes
* Bottom sheet transitions
* Property preview transitions

Avoid:

* Constant floating animations
* Decorative bouncing
* Excessive spring effects
* Long entrance animations
* Animation on every component

Animation should be fast and purposeful.

---

# 32. Accessibility

The application should support:

* Keyboard navigation
* Visible focus states
* Sufficient contrast
* Semantic HTML
* Accessible form labels
* Screen-reader-friendly controls
* Reduced-motion preference

Map controls must have accessible labels.

---

# 33. Performance Requirements

The application should prioritize performance.

Requirements:

* Do not load all properties at once.
* Query according to map viewport.
* Use marker clustering for dense areas.
* Lazy-load property images.
* Optimize image sizes.
* Avoid unnecessary client-side rendering.
* Avoid unnecessary React re-renders.
* Use server-side data fetching where appropriate.
* Keep JavaScript bundles reasonable.
* Debounce map/search/filter requests.

---

# 34. Supabase Security

Row Level Security must be enabled.

Public users:

* Can read publicly available properties.
* Can read public facilities.

Authenticated users:

* Can manage their own favorites.
* Can manage their own profile.

Admin:

* Can create/update/delete properties.
* Can manage facilities.

Never expose Supabase service-role keys to the client.

---

# 35. Admin Functionality

A minimal admin interface should allow:

### Properties

* Create
* Edit
* Delete
* Publish/unpublish
* Upload images
* Set location

### Facilities

* Create
* Edit
* Delete

### Data

* View property count
* View published/unpublished count
* Basic data management

Admin UI does not need to be the visual focus of the project.

---

# 36. Seed Data

The project must include realistic development/demo data.

Do NOT use:

```text
Property 1
Property 2
Lorem ipsum
123 Main Street
```

Instead use realistic structured data appropriate for the selected city/region.

Clearly mark demo/mock data internally where necessary.

Never present invented market statistics as real-world facts.

---

# 37. Main Pages

## `/`

Main map discovery experience.

## `/properties/[id]`

Property details.

## `/compare`

Property comparison.

## `/favorites`

Saved properties.

## `/analysis`

Area/property intelligence.

## `/admin`

Administrative management.

---

# 38. Main User Flow

```text
Open application
      ↓
Interactive map
      ↓
Search / filter
      ↓
Properties update
      ↓
Select property
      ↓
Preview
      ↓
View property
      ↓
Explore neighborhood
      ↓
Analyze price / facilities
      ↓
Compare or favorite
```

---

# 39. Error / Empty States

Design intentional states for:

### No properties

```text
No properties found in this area.

Try expanding your search area
or changing your filters.
```

### Loading

Use map-aware loading states.

Do not show excessive skeleton cards when the map itself is the primary content.

### Failed request

Provide a clear retry action.

### Missing property

Provide a proper 404 state.

---

# 40. Data Accuracy Rules

The product must distinguish between:

### Verified data

Data explicitly confirmed by the system/admin.

### Listing data

Information supplied by property listings.

### Calculated data

Examples:

```text
price/sqft
distance
nearby facility count
average listing price
```

### Estimated data

Any estimation must be explicitly labelled.

The system must never make unsupported claims such as:

> “This is the best property in the area.”

Instead display transparent metrics.

---

# 41. Future Features

These are NOT required for V1 but architecture should not prevent them.

Potential future features:

* Historical price trends
* Rental yield calculation
* Advanced property scoring
* Transit accessibility
* Walkability analysis
* Crime/safety datasets where legally and reliably available
* Flood-risk layers
* School quality datasets
* Property market analytics
* Agent accounts
* Property owner accounts
* AI-assisted property search
* Saved search alerts

---

# 42. AI Development Rules

Because the application will be developed using AI coding tools, the AI agent must follow these rules.

## Code quality

Do not generate unnecessary abstractions.

Do not duplicate components.

Do not create huge files containing unrelated functionality.

Use clear component boundaries.

Use TypeScript strictly.

Avoid `any` unless technically justified.

Do not disable linting/type checking simply to make code compile.

---

# 43. AI UI Generation Rules

Before creating a component, consider:

1. What user problem does this component solve?
2. Is the component necessary?
3. Does it improve information hierarchy?
4. Does it visually compete with the map?
5. Does it follow the existing design system?

Do not create UI elements merely to make the page look “full”.

Whitespace is acceptable.

---

# 44. Design Consistency Rules

Create design tokens before building many components.

At minimum define:

```text
Typography scale
Spacing scale
Border radius scale
Border colors
Surface colors
Text colors
Accent colors
Status colors
Shadow levels
```

Use tokens consistently.

Do not invent a new color, radius, shadow, or font size for every component.

---

# 45. No Copy-Paste Design Rule

Do not copy the visual structure of popular products such as:

* Zillow
* Airbnb
* Google Maps
* Linear
* Notion
* Stripe
* Vercel

These can be studied for interaction patterns, but the final visual design must have its own identity.

---

# 46. Acceptance Criteria

The V1 is considered complete when:

### Map

* [ ] Map loads successfully.
* [ ] Properties appear geographically.
* [ ] Markers are interactive.
* [ ] Marker clustering works where needed.
* [ ] Map viewport changes trigger appropriate property queries.

### Search

* [ ] Location search works.
* [ ] Property filters work.
* [ ] Multiple filters can be combined.

### Property

* [ ] Property preview works.
* [ ] Property details page works.
* [ ] Images work.
* [ ] Price/sqft is calculated correctly when data is available.

### Neighborhood

* [ ] Nearby facilities can be displayed.
* [ ] Facility layers can be toggled.
* [ ] Area statistics can be calculated.

### User

* [ ] Authentication works where required.
* [ ] Favorites work.
* [ ] Comparison works.

### Admin

* [ ] Admin can manage properties.
* [ ] Admin can manage facilities.

### Design

* [ ] No excessive shadows.
* [ ] No generic AI gradients.
* [ ] No excessive rounded cards.
* [ ] Typography has clear hierarchy.
* [ ] UI does not visually overpower the map.
* [ ] Components use a consistent design system.
* [ ] Visual identity is distinct from generic AI-generated SaaS templates.
* [ ] No unnecessary decorative elements.

### Performance

* [ ] Properties are queried based on viewport.
* [ ] Images are optimized/lazy-loaded.
* [ ] Dense markers are clustered.
* [ ] Unnecessary client rendering is avoided.
* [ ] No obvious UI jank during map interaction.

---

# 47. Definition of Done

A feature is not considered complete merely because it technically works.

Every feature must satisfy:

```text
Functional
    +
Accessible
    +
Responsive
    +
Performant
    +
Visually coherent
    +
Consistent with design system
```

The final product should feel like a deliberately designed real-estate intelligence product created by a professional product team, not a collection of AI-generated components.

---

# 48. Final Product Principle

The most important principle:

> **Map first. Data second. Decoration last.**

Every design and engineering decision should reinforce the user's ability to understand:

**“Where is this property, what is around it, and how does it compare with the surrounding area?”**
