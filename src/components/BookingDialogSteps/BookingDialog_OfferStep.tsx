import React, { useRef, useEffect } from "react";
import FloatingInput from "../FloatingInput";
import { Info } from "lucide-react";

type AngebotState = {
  angebot: string;
  geschwister: boolean;
  geschwisterName: string;
  ausgewaehlteTage: string[];
};

type OfferStepProps = {
  angeboteMatrix: any[];
  child: { schule: string };
  angebote: AngebotState[];
  setAngebote: React.Dispatch<React.SetStateAction<AngebotState[]>>;
  handleTagCheckbox: (idx: number, tag: string, checked: boolean) => void;
  geschwister: boolean;
  setGeschwister: (checked: boolean) => void;
  geschwisterName: string;
  setGeschwisterName: (name: string) => void;
  t: (key: string) => string;
};

const OfferStep: React.FC<OfferStepProps> = ({
  angeboteMatrix,
  child,
  angebote,
  setAngebote,
  handleTagCheckbox,
  geschwister,
  setGeschwister,
  geschwisterName,
  setGeschwisterName,
  t,
}) => {
  let angeboteList: any[] = [];
  if (Array.isArray(angeboteMatrix)) {
    const found = angeboteMatrix.find((s: any) => s.schule === child.schule);
    angeboteList = found?.angebote ?? [];
  }

  return (
    <div>
      <label className="block font-medium mb-2 text-gray-700">
        {t("offer.selectInstruction")}
      </label>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              <th className="border px-1 py-1 bg-gray-100 w-32 text-left whitespace-nowrap"></th>
              <th className="border px-2 py-1 bg-gray-100 w-10 text-right whitespace-nowrap">
                {t("offer.uhrzeiten")}
              </th>
              {["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag"].map(
                (tag) => (
                  <th
                    key={tag}
                    className="border px-2 py-1 bg-gray-100 text-center"
                  >
                    {t(`weekdays.${tag}`)}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {angeboteList.length === 0
              ? null
              : angeboteList.map((angebot: any) => (
                  <tr key={angebot.angebot}>
                    <td className="border px-1 py-1 font-medium w-32 text-left whitespace-nowrap">
                      {angebot.angebot}
                    </td>
                    <td className="border px-1 py-1 font-medium w-10 text-left whitespace-nowrap">
                      {angebot.uhrzeitVon && angebot.uhrzeitBis && (
                        <span className="ml-2 text-xs text-gray-500">
                          {angebot.uhrzeitVon}
                          {angebot.uhrzeitVon && angebot.uhrzeitBis
                            ? " – "
                            : ""}
                          {angebot.uhrzeitBis}
                        </span>
                      )}
                    </td>
                    {[
                      "Montag",
                      "Dienstag",
                      "Mittwoch",
                      "Donnerstag",
                      "Freitag",
                    ].map((tag) => {
                      const zeit = Array.isArray(angebot.zeiten)
                        ? angebot.zeiten.find((z: any) => z.tag === tag)
                        : undefined;
                      const checked = angebote.some(
                        (a) =>
                          a.angebot === angebot.angebot &&
                          a.ausgewaehlteTage.includes(tag)
                      );
                      const abweichend =
                        zeit &&
                        (("uhrzeitVon" in zeit &&
                          zeit.uhrzeitVon !== undefined) ||
                          ("uhrzeitBis" in zeit &&
                            zeit.uhrzeitBis !== undefined));
                      return (
                        <td
                          key={tag}
                          className="border px-2 py-1 text-center relative"
                        >
                          {zeit ? (
                            <span className="inline-flex items-center justify-center w-full h-full">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const idx = angebote.findIndex(
                                    (a) => a.angebot === angebot.angebot
                                  );
                                  if (idx === -1) {
                                    setAngebote((prev) => [
                                      ...prev,
                                      {
                                        angebot: angebot.angebot,
                                        geschwister: false,
                                        geschwisterName: "",
                                        ausgewaehlteTage: [tag],
                                      },
                                    ]);
                                  } else {
                                    handleTagCheckbox(
                                      idx,
                                      tag,
                                      e.target.checked
                                    );
                                  }
                                }}
                              />
                            </span>
                          ) : null}
                          {abweichend && (
                            <span className="absolute top-2 right-1 group">
                              <Info className="w-4 h-4" stroke="#2563eb" />
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                                {`${
                                  zeit.uhrzeitVon ?? angebot.uhrzeitVon ?? ""
                                }${
                                  (zeit.uhrzeitVon ?? angebot.uhrzeitVon) &&
                                  (zeit.uhrzeitBis ?? angebot.uhrzeitBis)
                                    ? "–"
                                    : ""
                                }${
                                  zeit.uhrzeitBis ?? angebot.uhrzeitBis ?? ""
                                }`}
                              </div>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="mt-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="geschwister"
              name="geschwister"
              checked={geschwister}
              onChange={(e) => setGeschwister(e.target.checked)}
              className="mr-2"
            />
            <label
              htmlFor="geschwister"
              className="font-medium whitespace-normal max-w-[650px]"
            >
              {t("offer.geschwisterHinweis")}
            </label>
          </div>
          {geschwister && (
            <FloatingInput
              label={t("offer.geschwisterName")}
              name="geschwisterName"
              required
              value={geschwisterName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setGeschwisterName(e.target.value)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OfferStep;
