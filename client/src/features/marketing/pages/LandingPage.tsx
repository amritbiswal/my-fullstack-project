import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card className="p-4">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </Card>
  );
}

function StepRow({
  index,
  title,
  desc,
}: {
  index: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-sm font-semibold text-teal-800">
        {index}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-sm text-slate-600">{desc}</div>
      </div>
    </div>
  );
}

function StatPill({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700">
      {label}
    </div>
  );
}

export default function LandingPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Responsive layout wrapper */}
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Top nav */}
        <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-8 border-b border-slate-100 bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-3">
              <button
                className="flex items-center gap-3"
                onClick={() => nav("/")}
                aria-label="Go to Packless home"
              >
                <div className="h-10 w-10 rounded-2xl bg-teal-600 shadow-sm" />
                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">
                    Packless
                  </div>
                  <div className="text-xs text-slate-500">
                    Travel light. Rent locally.
                  </div>
                </div>
              </button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="h-10 px-3"
                  onClick={() => nav("/login")}
                >
                  Login
                </Button>
                <Button className="h-10 px-3" onClick={() => nav("/register")}>
                  Register
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* HERO (two-column on desktop, single column on mobile) */}
        <div className="py-10 sm:py-12 lg:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            {/* Left: copy */}
            <div>
              <Badge tone="teal">Packless Pass • Verified rentals</Badge>

              <h1 className="mt-3 text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                Travel luggage-free.
                <span className="block text-slate-700">
                  Rent what you need at your destination.
                </span>
              </h1>

              <p className="mt-4 max-w-xl text-base text-slate-600 sm:text-lg">
                Packless connects tourists with verified local rental providers.
                Choose city and dates, browse what’s available, and book
                securely — from clothes and daily wares to gear and gadgets.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  className="h-11 w-full sm:w-auto"
                  onClick={() => nav("/register")}
                >
                  Get started
                </Button>
                <Button
                  variant="secondary"
                  className="h-11 w-full sm:w-auto"
                  onClick={() => nav("/login")}
                >
                  I have an account
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <StatPill label="Verified units" />
                <StatPill label="Secure deposits" />
                <StatPill label="City/date availability" />
                <StatPill label="Provider inventory" />
              </div>
            </div>

            {/* Right: app preview frame */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[420px]">
                <div className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
                  {/* Fake status bar */}
                  <div className="flex items-center justify-between px-5 pt-4 text-xs text-slate-500">
                    <span>Packless</span>
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-teal-600" />
                      Online
                    </span>
                  </div>

                  <div className="px-5 pb-5 pt-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-sm font-semibold text-slate-900">
                        Your trip
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="text-[11px] text-slate-500">City</div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">
                            Paris
                          </div>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-white p-3">
                          <div className="text-[11px] text-slate-500">
                            Dates
                          </div>
                          <div className="mt-1 text-sm font-semibold text-slate-800">
                            4 days
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
                        <div className="text-[11px] text-slate-500">
                          Popular today
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-800">
                          Rain jacket • Power adapter • Daypack
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-slate-200 p-3">
                        <div className="text-xs text-slate-500">Verified</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Units
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-3">
                        <div className="text-xs text-slate-500">Secure</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Deposit
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-3">
                        <div className="text-xs text-slate-500">Fast</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Booking
                        </div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 p-3">
                        <div className="text-xs text-slate-500">Optional</div>
                        <div className="mt-1 text-sm font-semibold text-slate-900">
                          Delivery
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl bg-teal-600 p-4 text-white">
                      <div className="text-sm font-semibold">Packless Pass</div>
                      <div className="mt-1 text-xs text-teal-50">
                        Verify once • Use QR at partner shops (V2)
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center text-xs text-slate-500">
                  App-style preview (mobile-first UI)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="py-10 border-t border-slate-100">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="text-xl font-semibold text-slate-900">
                How Packless works
              </div>
              <div className="mt-2 text-sm text-slate-600">
                A clear workflow that makes rentals reliable for tourists and
                manageable for providers.
              </div>

              <div className="mt-5 space-y-4">
                <StepRow
                  index="1"
                  title="Set trip (city + dates)"
                  desc="You only see inventory that can be allocated during your travel window."
                />
                <StepRow
                  index="2"
                  title="Browse catalog (SKUs) & availability"
                  desc="Items are listed like an e-commerce app but backed by real provider units."
                />
                <StepRow
                  index="3"
                  title="Staff verification unlocks ACTIVE"
                  desc="Providers submit units; staff approves/rejects. Only ACTIVE units are bookable."
                />
                <StepRow
                  index="4"
                  title="Book securely"
                  desc="Managed rentals support deposits; verified-only mode for expensive/heavy items."
                />
              </div>
            </div>

            <Card className="p-5">
              <div className="text-sm font-semibold text-slate-900">
                Why this is better for tourists
              </div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>• Travel lighter and avoid baggage fees.</li>
                <li>
                  • Rent locally with verified units and transparent rules.
                </li>
                <li>• Plan ahead: book essentials before you arrive.</li>
                <li>• Optional delivery and pickup as the network grows.</li>
              </ul>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <Button className="w-full" onClick={() => nav("/register")}>
                  Create account
                </Button>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => nav("/login")}
                >
                  Login
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* CATEGORIES */}
        <div className="py-10 border-t border-slate-100">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xl font-semibold text-slate-900">
                What you can rent
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Start small with essentials, expand into premium categories over
                time.
              </div>
            </div>
            <Badge tone="orange">Catalog</Badge>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Free-size clothes"
              desc="Rain jackets, hoodies, basics, seasonal wear."
            />
            <FeatureCard
              title="Daily wares"
              desc="Umbrella, adapters, chargers, towels, hair dryer."
            />
            <FeatureCard
              title="Adventure gear"
              desc="Trekking, skiing, snorkeling, camping essentials."
            />
            <FeatureCard
              title="Audio-video"
              desc="Action cams, tripods, mics, speakers."
            />
            <FeatureCard
              title="Designer wear"
              desc="Special occasions and premium events (selected cities)."
            />
            <FeatureCard
              title="Local services"
              desc="Pickup/drop support as demand grows (V2)."
            />
          </div>

          <Card className="mt-4 p-5">
            <div className="text-sm font-semibold text-slate-900">
              V2: Packless Pass QR
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Verify once in the app. Use your QR code at partner hotels and
              rental shops for quick check-in.
            </div>
          </Card>
        </div>

        {/* TRUST & SAFETY */}
        <div className="py-10 border-t border-slate-100">
          <div className="text-xl font-semibold text-slate-900">
            Trust & safety
          </div>
          <div className="mt-2 text-sm text-slate-600">
            The platform stays reliable by separating “catalog SKUs” from
            “verified units”.
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            <Card className="p-5">
              <div className="text-sm font-semibold">
                Verified providers & units
              </div>
              <div className="mt-1 text-sm text-slate-600">
                Provider lists → staff verifies → unit becomes ACTIVE and
                visible to tourists.
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-sm font-semibold">Deposit protection</div>
              <div className="mt-1 text-sm text-slate-600">
                Deposits are secured for managed rentals and returned after safe
                return.
              </div>
            </Card>
            <Card className="p-5">
              <div className="text-sm font-semibold">Two transaction modes</div>
              <div className="mt-1 text-sm text-slate-600">
                Managed rentals (deposit + platform flow) and Verified-only for
                heavy/expensive items.
              </div>
            </Card>
          </div>
        </div>

        {/* FINAL CTA */}
        <div className="py-12 border-t border-slate-100">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="text-2xl font-semibold text-slate-900">
                  Ready to go Packless?
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  Create your account and explore inventory by city and dates.
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="h-11 w-full"
                  onClick={() => nav("/register")}
                >
                  Register
                </Button>
                <Button
                  variant="secondary"
                  className="h-11 w-full"
                  onClick={() => nav("/login")}
                >
                  Login
                </Button>
              </div>
            </div>
          </div>

          <div className="py-6 text-center text-xs text-slate-500">
            © {new Date().getFullYear()} Packless • Travel light
          </div>
        </div>
      </div>
    </div>
  );
}
