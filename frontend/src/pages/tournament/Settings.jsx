import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function Settings() {
    return (
      <div className="flex flex-col items-center justify-center text-white p-5 ">
          <Card className="w-full max-w-lg shadow-xl">
              <CardHeader>
                  <CardTitle className="text-center text-white">
                      Tournament Settings
                  </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                  <Button>
                    Show Tournament
                  </Button>
                  <Button>
                    Start Tournament
                  </Button>
                  <Button>
                    Edit Tournament
                  </Button>
                  <Button>
                    Delete Tournament
                  </Button>
              </CardContent>
          </Card>
      </div>
    );
}

export default Settings