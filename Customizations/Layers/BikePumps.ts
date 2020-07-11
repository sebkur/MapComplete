import {LayerDefinition} from "../LayerDefinition";
import {And, Or, Tag} from "../../Logic/TagsFilter";
import {OperatorTag} from "../Questions/OperatorTag";
import * as L from "leaflet";
import { PumpManual } from "../Questions/PumpManual";
import FixedName from "../Questions/FixedName";

export class BikePumps extends LayerDefinition {

    constructor() {
        super();
        this.name = "pomp";
        this.icon = "./assets/bike_pump.svg";

        this.overpassFilter = new Or([
            new And([
                new Tag("amenity", "compressed_air"),
                new Tag("bicycle", "yes"),
            ])
            ]
        );


        this.newElementTags = [
            new Tag("amenity", "compressed_air"),
            new Tag("bicycle", "yes"),
            // new Tag("fixme", "Toegevoegd met MapComplete, geometry nog uit te tekenen")
        ];
        this.maxAllowedOverlapPercentage = 10;

        this.minzoom = 13;
        this.style = this.generateStyleFunction();
        this.title = new FixedName("pomp");
        this.elementsToShow = [
            // new NameQuestion(),
            // new AccessTag(),
            new OperatorTag(),
            new PumpManual()
        ];

    }


    private generateStyleFunction() {
        const self = this;
        return function (properties: any) {
            // let questionSeverity = 0;
            // for (const qd of self.elementsToShow) {
            //     if (qd.IsQuestioning(properties)) {
            //         questionSeverity = Math.max(questionSeverity, qd.options.priority ?? 0);
            //     }
            // }

            // let colormapping = {
            //     0: "#00bb00",
            //     1: "#00ff00",
            //     10: "#dddd00",
            //     20: "#ff0000"
            // };

            // let colour = colormapping[questionSeverity];
            // while (colour == undefined) {
            //     questionSeverity--;
            //     colour = colormapping[questionSeverity];
            // }

            return {
                color: "#00bb00",
                icon: new L.icon({
                    iconUrl: self.icon,
                    iconSize: [40, 40]
                })
            };
        };
    }

}