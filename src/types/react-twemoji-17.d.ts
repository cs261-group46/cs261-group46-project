declare module "react-twemoji-17" {
    import React, {ReactNode} from "react";

    type TwemojiProps = {
        children?: ReactNode
        noWrapper?: boolean
        options?: object
        tag?: string
    }

    export default class Twemoji extends React.Component<TwemojiProps, any> {

    }
}