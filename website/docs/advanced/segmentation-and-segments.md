---
id: segments
title: Segmentation & Segments
---
Segments allow you to group your users based on any of their properties. This way you can 
define segments of your users and then assign them to specific feature flags. If you update a segment definition, it will update all 
feature flags that are assigned to it. You can think of segments as reusable targeting rules. If you have groups of users that you want to target regularly with 
different features, it's a good idea to define a segment for each group.

*For example, you can define a segment called "Beta Users" and assign that segment to all future features that you want to be available for beta users.*

You can define your segments on the [ConfigCat Dashboard](https://app.configcat.com/product/segments).

One segment belongs to one product and can be used in multiple feature flags within the same product.

### Anatomy of a Segment

| Field                | Purpose                                                                                                                              |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Name                 | The name of the segment.                                                                                                             |
| Description          | A description of the segment. It's a good idea to add a hint that helps you remember what the segment is for.                        |
| Comparison attribute | The attribute that the segment is based on. Could be "User ID", "Email", "Country" or any custom attribute.                          |
| Comparator           | The comparison operator. Holds the connection between the attribute and the value.                                                   |
| Comparison value     | The value that the attribute is compared to. Could be a string, a number, a semantic version or a list, depending on the comparator. |