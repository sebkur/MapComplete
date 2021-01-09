import {UIElement} from "../UIElement";
import {UIEventSource} from "../../Logic/UIEventSource";
import TagRenderingConfig from "../../Customizations/JSON/TagRenderingConfig";
import TagRenderingQuestion from "./TagRenderingQuestion";
import Translations from "../i18n/Translations";
import Combine from "../Base/Combine";
import TagRenderingAnswer from "./TagRenderingAnswer";
import State from "../../State";
import Svg from "../../Svg";
import {TagUtils} from "../../Logic/Tags";

export default class EditableTagRendering extends UIElement {
    private readonly _tags: UIEventSource<any>;
    private readonly _configuration: TagRenderingConfig;

    private _editMode: UIEventSource<boolean> = new UIEventSource<boolean>(false);
    private _editButton: UIElement;

    private _question: UIElement;
    private _answer: UIElement;

    constructor(tags: UIEventSource<any>,
                configuration: TagRenderingConfig) {
        super(tags);
        this._tags = tags;
        this._configuration = configuration;

        this.ListenTo(this._editMode);
        this.ListenTo(State.state?.osmConnection?.userDetails)

        this._answer = new TagRenderingAnswer(tags, configuration);
        this._answer.SetStyle("width:100%;")
        this._question = this.GenerateQuestion();
        this.dumbMode = false;

        if (this._configuration.question !== undefined) {
            if (State.state?.featureSwitchUserbadge?.data) {
                // 2.3em total width
                const self = this;
                this._editButton =
                    Svg.pencil_svg().SetClass("edit-button")
                        .onClick(() => {
                            self._editMode.setData(true);
                        });
            }
        }
    }

    InnerRender(): string {
        if (!this._configuration?.condition?.matchesProperties(this._tags.data)) {
            return "";
        }
        if (this._editMode.data) {
            return this._question.Render();
        }
        if (this._configuration.multiAnswer) {
            const atLeastOneMatch = this._configuration.mappings.some(mp =>TagUtils.MatchesMultiAnswer(mp.if, this._tags.data));
            console.log("SOME MATCH?", atLeastOneMatch)
            if (!atLeastOneMatch) {
                return "";
            }
        } else if (this._configuration.GetRenderValue(this._tags.data) === undefined) {
            return "";
        }

        return new Combine([this._answer,
            (State.state?.osmConnection?.userDetails?.data?.loggedIn ?? true) ? this._editButton : undefined
        ]).SetClass("answer")
            .Render();
    }

    private GenerateQuestion() {
        const self = this;
        if (this._configuration.question !== undefined) {
            // And at last, set up the skip button
            const cancelbutton =
                Translations.t.general.cancel.Clone()
                    .SetClass("cancel")
                    .onClick(() => {
                        self._editMode.setData(false)
                    });

            return new TagRenderingQuestion(this._tags, this._configuration,
                () => {
                    self._editMode.setData(false)
                },
                cancelbutton)
        }
    }

}