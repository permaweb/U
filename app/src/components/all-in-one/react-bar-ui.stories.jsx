import type { ComponentStory, ComponentMeta } from "@storybook/react";
import { BurnArModel } from "./react-bar-ui";

const Story = {
  component: BurnArModel,
  title: "All in one",
};
export default Story;

const Template = (args) => (
  <BurnArModel isOpen={true} setIsOpen={() => console.log} />
);

export const Primary = Template.bind({});
Primary.args = {};
