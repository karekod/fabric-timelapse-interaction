
import { Template } from "@/types/sidebar";

export const sampleTemplates: Template[] = [
  {
    id: "template1",
    name: "Basic Presentation",
    type: "presentation",
    thumbnail: "https://picsum.photos/id/1015/300/200",
    preview: "https://picsum.photos/id/1015/300/200",
    animations: [
      {
        elementType: "heading",
        animationType: "fade",
        startTime: 10,
        duration: 20
      }
    ]
  },
  {
    id: "template2",
    name: "Instagram Story",
    type: "social",
    thumbnail: "https://picsum.photos/id/1016/300/200",
    preview: "https://picsum.photos/id/1016/300/200",
    animations: [
      {
        elementType: "rectangle",
        animationType: "scale",
        startTime: 0,
        duration: 15
      },
      {
        elementType: "subheading",
        animationType: "move",
        startTime: 20,
        duration: 25
      }
    ]
  },
  {
    id: "template3",
    name: "YouTube Banner",
    type: "banner",
    thumbnail: "https://picsum.photos/id/1018/300/200",
    preview: "https://picsum.photos/id/1018/300/200",
    animations: [
      {
        elementType: "rectangle",
        animationType: "color",
        startTime: 5,
        duration: 30
      }
    ]
  },
  {
    id: "template4",
    name: "Data Visualization",
    type: "infographic",
    thumbnail: "https://picsum.photos/id/1019/300/200",
    preview: "https://picsum.photos/id/1019/300/200",
    animations: [
      {
        elementType: "circle",
        animationType: "rotate",
        startTime: 0,
        duration: 40
      },
      {
        elementType: "text",
        animationType: "blur",
        startTime: 45,
        duration: 20
      }
    ]
  }
];
