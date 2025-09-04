
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSwap } from "@/lib/store";

export function MatchCard({ user }: any){
  const sendRequest = useSwap(s => s.sendRequest);
  const me = useSwap(s => s.me);
  async function requestHour(){
    if(!me?.email) return alert("Sign in");
    const toEmail = (user.name as string).toLowerCase().replace(/\s+/g,'.') + '@aui.ma';
    if (toEmail === me.email) return alert("Pick another user");
    await sendRequest(toEmail, user.teach?.[0] || 'CS150', 60, 'Swap 1 hour?');
    alert('Request sent');
  }
  return (
    <Card className="flex flex-col md:flex-row md:items-center md:justify-between">
      <CardHeader className="flex flex-row items-center gap-3 border-none p-5">
        <Avatar name={user.name}/>
        <div>
          <CardTitle className="mb-1">{user.name}</CardTitle>
          <div className="text-xs text-gray-600">{user.program||'Student'} • {user.university||'AUI'}</div>
        </div>
      </CardHeader>
      <CardContent className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-xs text-gray-600">Teaches</div>
          <div className="flex flex-wrap gap-2">{(user.teach||[]).map((t:string)=><Badge key={t}>{t}</Badge>)}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-600">Wants to learn</div>
          <div className="flex flex-wrap gap-2">{(user.learn||[]).map((t:string)=><Badge key={t}>{t}</Badge>)}</div>
        </div>
        <Button onClick={requestHour}>Request 60m</Button>
      </CardContent>
    </Card>
  );
}
