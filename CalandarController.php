<?php
namespace backend\controllers;

use backend\models\AdminCompany;
use backend\models\Broker;
use backend\models\Events;
use backend\models\Logs;
use backend\models\Mail;
use backend\models\Sms;
use backend\models\Tracking;
use backend\models\Trucks;
use backend\models\UserGps;
use common\models\User;
use Yii;
use yii\web\Controller;
use yii\filters\VerbFilter;

class CalendarController extends Controller
{
    public function actionGetbygroup($group_id){
        $user_id = Yii::$app->user->id;
        $userInfo = User::find()
            ->where(['id' => $user_id])
            ->one();

        $modelSchedulelist = new Schedulelist();
        $modelSchedule = new Schedule();

        $SheduleList = $modelSchedulelist::find()
            ->where([
                'group_id' => $group_id

            ])
            ->one();

        $GroupsModel = Group::find()
            ->where([
                'id' => $group_id
            ])
            ->one();
        $predmetModel = Predmet::find()->all();
        $arrayPredmets = array();
        foreach ($predmetModel as  $itemsPredmet) {
            $arrayPredmets[$itemsPredmet->id] = $itemsPredmet;
        }
		
        $OptionsSmena = Options::find()
            ->where(['id' => $GroupsModel->smena_id])
            ->one();

        $arrayTimePara = array();

        for($i=1; $i<=6; $i++){
            $start = 'start_'.$i;
            $end = 'end_'.$i;
            $arrayTimePara[$i.'sh'] = date_parse($OptionsSmena->$start)['hour'];
            $arrayTimePara[$i.'eh'] = date_parse($OptionsSmena->$end)['hour'];
            $arrayTimePara[$i.'sm'] = date_parse($OptionsSmena->$start)['minute'];
            $arrayTimePara[$i.'em'] = date_parse($OptionsSmena->$end)['minute'];
        }

        $y = date("Y");
        $m = date("m");
        $w = date("w");

        $number = cal_days_in_month(CAL_GREGORIAN, $m, $y);
        $weekName=array(0=>"вс", "пн","вт","ср","чт","пт","сб");

        $forResultsArray = array();
        $id = 0;

        for($i=1; $i<=$number; $i++){
            $week =  date('w',mktime (0, 0, 0, $m, $i, $y));
            $Shedule = $modelSchedule::find()
                ->where([
                    'schedule_list_id' => $SheduleList->id,
                    'weekday' => $week,
                    'college_id' => $userInfo->college_id
                ])
                ->all();
            foreach ($Shedule as $SheduleItems) {
                if($SheduleItems->predmet_id != 0) {
                    if($SheduleItems->dop_predmet_id != 0) {

                        $forResultsArray[$id] = array(
                            'id' => $id,
                            'summary' => $arrayPredmets[$SheduleItems->predmet_id]->name.'('.$SheduleItems->kabinet.')'.'/'.$arrayPredmets[$SheduleItems->dop_predmet_id]->name.'('.$SheduleItems->dop_cabinet_id.')',
                            'startTime' => date( mktime($arrayTimePara[$SheduleItems->para.'sh'], $arrayTimePara[$SheduleItems->para.'sm'], 00, $m, $i, $y)),
                            'endTime'=>  date( mktime($arrayTimePara[$SheduleItems->para.'eh'], $arrayTimePara[$SheduleItems->para.'em'], 00, $m, $i, $y)),
                            'calendar' => "cal1"
                        );
                    }
                    else{
                        $forResultsArray[$id] = array(
                            'id' => $id,
                            'summary' => $arrayPredmets[$SheduleItems->predmet_id]->name.'('.$SheduleItems->kabinet.')',
                            'startTime' => date( mktime($arrayTimePara[$SheduleItems->para.'sh'], $arrayTimePara[$SheduleItems->para.'sm'], 00, $m, $i, $y)),
                            'endTime'=>  date( mktime($arrayTimePara[$SheduleItems->para.'eh'], $arrayTimePara[$SheduleItems->para.'em'], 00, $m, $i, $y)),
                            'calendar' => "cal1"
                        );
                    }
                    $id++;

                }
            }
        }
        return json_encode($forResultsArray);
    }
    

    public function actionNewEvent($date,$label,$type_sender,$timeStart)
    {
        $user_id = Yii::$app->user->id;
        if($user_id)
        {
            $userInfo = User::find()
                ->where(['id' => $user_id])
                ->one();
            $org_id = $userInfo->org_id;
            if($this->getAdminCompany())
                $org_id = $this->getAdminCompany();
            if($date != "" && $label != "" && $timeStart != "")
            {
                $newEvent = new Events();
                $newEvent->date_start = $date;
                $newEvent->label = $label;
                $newEvent->type_sender = $type_sender;
                $newEvent->time_start = $timeStart;
                $newEvent->user_id = $user_id;
                $newEvent->org_id = $userInfo->org_id;
                if($newEvent->save())
                {

                    $SMS = new Sms();
                    $EMAIL = new Mail();

                    $date = new \DateTime($date, new \DateTimeZone('UTC'));
                    $label = $date->format('d-m-Y')." ". $timeStart . " " . $label;
                    switch ($type_sender)
                    {
                        case 2:
                            $SMS->SendAllUserRoleCompany("dispatcher",$org_id,$label);
                            break;
                        case 3:
                            $SMS->SendAllUserRoleCompany("driver",$org_id,$label);
                            break;
                        case 4:
                            $SMS->SendAllUserRoleCompany("accountant",$org_id,$label);
                            break;
                        case 5:
                            $SMS->SendAllUserRoleCompany("safety",$org_id,$label);
                            break;
                        case 6:
                            $EMAIL->SendAllUserRoleCompany("dispatcher",$org_id,$label);
                            break;
                        case 7:
                            $EMAIL->SendAllUserRoleCompany("driver",$org_id,$label);
                            break;                        
                    }
                    return "ok";
                }
            }
        }
    }

    public function actionGetmyevents(){

        $user_id = Yii::$app->user->id;
        $userInfo = User::find()
            ->where(['id' => $user_id])
            ->one();

        $monday_Y_m_d = date('Y-m-d', strtotime( "previous monday" ));
        $friday_Y_m_d = date('Y-m-d', strtotime( "next Tuesday" ));


        $first = date('Y-m-d', strtotime( "first day of this month" ));
        $last = date('Y-m-d', strtotime( "last day of this month" ));


        $org_id = $userInfo->org_id;

        if($this->getAdminCompany())
            $org_id = $this->getAdminCompany();

        $Events = Tracking::find()
            ->where([
                'org_id' => $org_id,
                'is_delete' => null
            ])
            ->andWhere(['between','pickup_date',$first, $last ])
            ->andWhere(['<>', 'status_disp', 'canceled'])
            ->select(['id','delivery_date','pickup_date','disp_id'])
            ->all();

        $forResultsArray = array();
        $id = 0;

        $Events = Events::find()
            ->where([
                'org_id' => $org_id,
                'is_delete' => null
            ])
            ->all();
        $id = 0;
        foreach ($Events as $event) {
            if($event->date_start &&  $event->label)
            {               
                $datestarttime = \DateTime::createFromFormat('Y-m-d H:i:s', $event->date_start . " " .$event->time_start);
                if (! $datestarttime) {

                    throw new \InvalidArgumentException(sprintf("'%s' is not a valid date.", $event->date_start));
                }
                $dateendtime = \DateTime::createFromFormat('Y-m-d H:i:s', $event->date_start . " " .$event->time_start);

                if (! $dateendtime) {
                    throw new \InvalidArgumentException(sprintf("'%s' is not a valid date.", $event->date_start));
                }
                $disp = "";
                $Disp = User::findOne($event->user_id);
                if($Disp)
                {
                    $disp = $Disp->fullname;
                }
                $date = date("m/d/Y", strtotime($event->date_start));
                $class = "event_blue";
                $forResultsArray[$id] = array(
                    'id' => $id,
                    'event_id' => $event->id,
                    'summary' => '<span class="progmenu '. $class .'">#' . $event->label . ", " .$disp . " " .$event->time_start . '</span>',
                    'desc' => "desc",
                    'startTime' => $dateendtime->getTimestamp(),
                    'endTime'=>  $dateendtime->getTimestamp(),
                    'calendar' => "Calendar1"
                );
                $id++;
            }
        }
        return json_encode($forResultsArray);
    }

    public function actionDeleteEvent($id)
    {
        $user_id = \Yii::$app->user->id;
        if($user_id)
        {
            $userInfo = User::find()
                ->where(['id' => $user_id])
                ->one();
            $Event = Events::findOne($id);
            if($Event)
            {
                if($userInfo->role == "admin" || $user_id == $Event->user_id)
                {
                    $Event->is_delete = 1;
                    if($Event->update())
                    {
                        return "ok";
                    }
                }
            }
        }
    }

    public function actionRemind()
    {
        $Events = Events::find()
            ->where([
                'is_delete' => null,
                'remind' => null
            ])
            ->all();

        if($Events)
        {
            foreach ($Events as $event) {
                $from = strtotime($event->date_start);
                $today = time();
                if($today < $from)
                {
                    $difference = $today - $from;
                    $cal_days = ((($from-$today)/60)/60)/24;
                    if($cal_days < 2)
                    {
                        $Event = Events::findOne($event->id);
                        $Event->remind = 1;
                        $Event->update();

                        $date = new \DateTime($event->date_start, new \DateTimeZone('UTC'));
                        $label = "<h3>Reminder from the <span style='color: #0b7ec4'>TRANS-BOOK</span>.</h3>" . $date->format('d-m-Y')." ". $event->time_start . " <h3>" . $event->label."</h3>";
                        $User = User::findOne($event->user_id);
                        $Email = new Mail();
                        $Email->NewEmail($label,"mail@trans-book.com","Reminder from the Trans-book.",$User->email);
                        $label = $date->format('d-m-Y')." ". $event->time_start . " " .$event->label; 
                        $Sms = new Sms();
                        $Sms->SendTo($User->phone,"Reminder from the Trans-book: " . $label);
                    }
                }
            }
        }
    }

    private function getAdminCompany()
    {
        $user_id = \Yii::$app->user->id;
        $AdminCompany = AdminCompany::find()
            ->where(['user_id' => $user_id])
            ->all();
        $ArraysIDADMIN = array();
        if($AdminCompany)
        {
            foreach ($AdminCompany as $item) {
                $ArraysIDADMIN[] = $item->company_id;
            }
        }
        return count($ArraysIDADMIN) > 0 ? $ArraysIDADMIN : null;
    }
}