import { NextResponse } from "next/server";
import { analyzeDuo } from "@/lib/riot-analyze";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const adcName = String(body.adcName ?? "").trim();
    const adcTag = String(body.adcTag ?? "").trim();
    const suppName = String(body.suppName ?? "").trim();
    const suppTag = String(body.suppTag ?? "").trim();
    const count = Number(body.count ?? 20);

    if (!adcName || !adcTag || !suppName || !suppTag) {
      return NextResponse.json(
        { error: "Renseigne les deux Riot ID complets : pseudo + tag." },
        { status: 400 }
      );
    }

    const analysis = await analyzeDuo({ adcName, adcTag, suppName, suppTag, count });
    return NextResponse.json(analysis);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur inconnue.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
