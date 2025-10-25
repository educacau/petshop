import {Request, Response} from 'express';
import dayjs from 'dayjs';

import {CreateScheduleService} from '../services/create-schedule.service';
import {ListSchedulesService} from '../services/list-schedules.service';
import {UpdateScheduleService} from '../services/update-schedule.service';
import {UpdateScheduleStatusService} from '../services/update-status.service';
import {DeleteScheduleService} from '../services/delete-schedule.service';
import {CustomerRescheduleService} from '../services/customer-reschedule.service';
import {CustomerCancelScheduleService} from '../services/customer-cancel.service';
import {ScheduleReportService} from '../services/report.service';

export class SchedulesController {
  constructor(
    private readonly createScheduleService = new CreateScheduleService(),
    private readonly listSchedulesService = new ListSchedulesService(),
    private readonly updateScheduleService = new UpdateScheduleService(),
    private readonly updateStatusService = new UpdateScheduleStatusService(),
    private readonly deleteScheduleService = new DeleteScheduleService(),
    private readonly reportService = new ScheduleReportService(),
    private readonly customerRescheduleService = new CustomerRescheduleService(),
    private readonly customerCancelService = new CustomerCancelScheduleService()
  ) {}

  list = async (req: Request, res: Response) => {
    const {from, to, serviceType, status, customerId, staffId} = req.query;
    const schedules = await this.listSchedulesService.execute({
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined,
      serviceType: typeof serviceType === 'string' ? serviceType : undefined,
      status: typeof status === 'string' ? status : undefined,
      customerId: typeof customerId === 'string' ? customerId : undefined,
      staffId: typeof staffId === 'string' ? staffId : undefined
    });
    res.json({data: schedules});
  };

  listMySchedules = async (req: Request, res: Response) => {
    const user = req.user!;
    const schedules = await this.listSchedulesService.execute({
      staffId: user.role === 'STAFF' ? user.id : undefined,
      customerId: user.role === 'CUSTOMER' ? user.id : undefined,
      from: dayjs().startOf('day').toISOString(),
      to: dayjs().endOf('day').toISOString()
    });
    res.json({data: schedules});
  };

  create = async (req: Request, res: Response) => {
    const payload = req.body;
    const schedule = await this.createScheduleService.execute({
      ...payload,
      scheduledAt: dayjs(payload.scheduledAt).toDate()
    });
    res.status(201).json({data: schedule});
  };

  update = async (req: Request, res: Response) => {
    const {scheduledAt, notes, price, staffId} = req.body;
    const schedule = await this.updateScheduleService.execute({
      id: req.params.id,
      scheduledAt: scheduledAt ? dayjs(scheduledAt).toDate() : undefined,
      notes,
      price,
      staffId
    });
    res.json({data: schedule});
  };

  updateStatus = async (req: Request, res: Response) => {
    const schedule = await this.updateStatusService.execute({
      id: req.params.id,
      status: req.body.status
    });
    res.json({data: schedule});
  };

  delete = async (req: Request, res: Response) => {
    await this.deleteScheduleService.execute(req.params.id);
    res.status(204).send();
  };

  rescheduleByCustomer = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({status: 'error', message: 'Unauthorized'});
    }

    const schedule = await this.customerRescheduleService.execute({
      scheduleId: req.params.id,
      customerId: req.user.id,
      scheduledAt: req.body.scheduledAt,
      notes: req.body.notes
    });

    res.json({data: schedule});
  };

  cancelByCustomer = async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({status: 'error', message: 'Unauthorized'});
    }

    await this.customerCancelService.execute({
      scheduleId: req.params.id,
      customerId: req.user.id
    });

    res.status(204).send();
  };

  summary = async (req: Request, res: Response) => {
    const {from, to} = req.query;
    const summary = await this.reportService.summary({
      from: typeof from === 'string' ? from : undefined,
      to: typeof to === 'string' ? to : undefined
    });
    res.json({data: summary});
  };
}


