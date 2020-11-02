<template>
    <div class="container-fluid" >
        <transition name="fade">
            <div id="preloader" v-show="loading"
                 style="padding-top: 250px; position: fixed; top: 0; left: 0; height: 100%; width: 100%; background:  rgba(0, 0, 0, .1); z-index: 9999">
                <img style="width: 120px;" src="/assets/img/spinner-blue.gif" align="center">
            </div>
        </transition>
        <vue-confirm-dialog class="confirm-dialog"></vue-confirm-dialog>
        <modal name="edit-schedule" width="450"
               :height="'auto'"
               :focusTrap="true"
               :adaptive="true"
        >
            <div style="height: 5px; border-bottom: #2e6da4; background: #337ab7; margin-bottom: 22px; margin-top: -2px; padding-top: 0; border-top-left-radius: 4px; border-top-right-radius: 4px"></div>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-lg-12 col-xs-12 col-md-12 col-sm-12">
                        <div class="form-horizontal" >
                             <div  class="input-group" v-if="element.id === -1">
                                <span class="input-group-addon" ><i class="glyphicon glyphicon-briefcase"></i></span>

                                <multi-select v-model="element.form.calendar" :options="calendarList"
                                              :multiple="false"
                                              :close-on-select="true" :clear-on-select="false" :preserve-search="true"
                                              placeholder="Календарь" label="name" track-by="id"
                                              :max-height="150"
                                              select-label="Выбрать"
                                              :hide-selected="false"
                                              :preselect-first="false">
                                    <template slot="selection"
                                              slot-scope="{ values, search, isOpen }">
                                        <span class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} выбрано
                                        </span>
                                    </template>
                                </multi-select>
                            </div>
                            <div style="color: darkred; font-size: 12px; text-align: right" v-if="element.form.calendar === null">Обязательное поле</div>
                            <div style="margin-bottom: 17px" v-if="element.form.calendar !== null && element.id === -1"></div>

                            <div  class="input-group">
                                <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                <multi-select v-model="element.form.employee" :options="employees" :multiple="false"
                                              :close-on-select="true" :clear-on-select="false" :preserve-search="true"
                                              placeholder="Сотрудник" label="name" track-by="id"
                                              :max-height="150"
                                              select-label="Выбрать"
                                              :hide-selected="false"
                                              :preselect-first="false">
                                    <template slot="selection"
                                              style="-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px; border: 0;"
                                              slot-scope="{ values, search, isOpen }">
                                        <span style=" -webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px; border: 0;"
                                              class="multiselect__single" v-if="values.length &amp;&amp; !isOpen">{{ values.length }} выбрано
                                        </span>
                                    </template>
                                </multi-select>
                            </div>
                            <div style="color: darkred; font-size: 12px;text-align: right" v-if="element.form.employee === null">Обязательное поле</div>
                            <div style="margin-bottom: 17px" v-if="element.form.employee !== null"></div>

                            <div style="margin-bottom: 17px" class="input-group">
                                <span class="input-group-addon"><i class="glyphicon glyphicon-home"></i></span>
                                <multi-select v-model="element.form.groups" :options="groups" :multiple="true"
                                              :close-on-select="false" :clear-on-select="false"
                                              :preserve-search="true"
                                              placeholder="Группы домов" label="name" track-by="id"
                                              :max-height="250"
                                              select-label="Выбрать группу"
                                              :hide-selected="true"
                                              :preselect-first="false">
                                    <template slot="selection"
                                              style="-webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px; border: 0;"
                                              slot-scope="{ values, search, isOpen }">
                                                <span style=" -webkit-border-radius: 0px;-moz-border-radius: 0px;border-radius: 0px; border: 0;"
                                                      class="multiselect__single"
                                                      v-if="values.length &amp;&amp; !isOpen">{{ values.length }} выбрано
                                                </span>
                                    </template>
                                </multi-select>
                            </div>

                            <div class="row">
                                <div class="col-lg-1 col-xs-1 col-md-1 col-sm-1" style="margin-bottom: 10px">
                                    <input type="checkbox" class="form-control" style="height: 30px; width: 30px; border-color: #C0C0C0" v-model="element.isAllDay">
                                </div>
                                <div class="col-lg-10 col-xs-10 col-md-10 col-sm-10" style="margin-bottom: 10px; padding-top: 10px">
                                    <span style="float: left; color: #707070">Весь день</span>
                                </div>

                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-xs-12 col-md-6 col-sm-6" style="margin-bottom: 15px">
                                    <datetime-picker v-model="element.start" :pick-time="true"></datetime-picker>
                                </div>
                                <div class="col-lg-6 col-xs-12 col-md-6 col-sm-6" style="margin-bottom: 15px">
                                    <datetime-picker v-model="element.end" :pick-time="true"></datetime-picker>
                                </div>
                            </div>


                            <div class="row" style="margin-top: 15px">
                                <div class="col-lg-3 col-xs-4 col-md-3 col-sm-3" style="">
                                    <button class="btn btn-primary btn-block" @click="saveSchedule(null)" :disabled="element.form.calendar === null || element.form.employee === null ">
                                        <span
                                                class="glyphicon glyphicon-floppy-disk" aria-hidden="true" style="font-size: 120%; margin-top: 3px"></span>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </modal>
        <div class="row">
            <div class="col-lg-12 col-sm-12 col-xs-12 col-md-12">
                <div class="row">
                    <div class="col-md-4 col-sm-4 col-lg-3 col-xs-12 "
                         style="font-family: Calibri; font-weight: bold; font-size: 18pt">
                        {{viewName}}
                    </div>
                    <div class="col-sm-3 col-lg-2 col-md-3 col-xs-6">
                        <button class="btn btn-primary" style="margin: 3px" v-on:click="prevView()"><span
                                class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button>
                        <button class="btn btn-primary" style="margin: 3px" v-on:click="today()"><span
                                class="glyphicon glyphicon-time"></span></button>
                        <button class="btn btn-primary" style="margin: 3px" v-on:click="nextView()"><span
                                class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button>
                    </div>
                    <div class="col-sm-4  col-lg-3 col-md-4 col-xs-6">
                        <button class="btn btn-primary" style="margin: 3px" :disabled="view === 'day'"
                                v-on:click="changeView('day')">День
                        </button>
                        <button class="btn btn-primary" style="margin: 3px" :disabled="view === 'week'"
                                v-on:click="changeView('week')">Неделя
                        </button>
                        <button class="btn btn-primary" style="margin: 3px" :disabled="view === 'month'"
                                v-on:click="changeView('month')">Месяц
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-1 col-xs-12 col-md-1 col-sm-1">
                <button @click="createModal()" class="btn btn-primary btn-block">
                    <span
                            class="glyphicon glyphicon-plus" aria-hidden="true"></span>
                </button>
            </div>
            <div class="col-sm-11 col-xs-12 col-md-11 col-lg-11" id="calendar-view-block" style="overflow: hidden;">
                <div id="view-schedule" role="tooltip" ref="tooltip" class="not-close-view">
                    <div :style="'background: '+getScheduleColor(element.calendarId)+'; height: 6px; width: 100%; margin-top: 0; margin-bottom: 5px; border-top-left-radius: 4px; border-top-right-radius: 4px'" ></div>
                    <div style="position: absolute; top: 5px; left: 1px; font-size: 9px">{{element.id}}</div>
                    <div class="row not-close-view" style="padding: 5px;">
                        <div class="not-close-view col-sm-12 col-md-12 col-xs-12 col-lg-12" style="text-align: left">
                            <div class="not-close-view" style="font-weight: bold; text-align: center;">{{element.title}}</div>
                            Группы:
                            <ol class="not-close-view" style="padding-left: 20px; text-align: left; font-weight: normal; font-style: italic">
                                <li class="not-close-view" v-for="gr in element.form.groups" :key="gr.id" style="font-size: 90%">{{gr.name}}</li>
                            </ol>
                        </div>
                        <div class="col-sm-4 col-md-4 col-xs-4 col-lg-4" style="padding-left: 15px; padding-right: 0">
                            <button class="btn btn-primary btn-block" title="Клонировать запись" @click="duplicateSchedule()"><span class="glyphicon glyphicon-duplicate" ></span></button>
                        </div>
                        <div class="col-sm-4 col-md-4 col-xs-4 col-lg-4" style="padding-left: 5px; padding-right: 5px">
                            <button class="btn btn-primary btn-block" title="Изменить запись" @click="editSchedule()"><span class="glyphicon glyphicon-edit" ></span></button>
                        </div>
                        <div class="col-sm-4 col-md-4 col-xs-4 col-lg-4" style="padding-left: 0; padding-right: 15px">
                            <button class="btn btn-primary btn-block" title="Удалить запись" @click="deleteSchedule(element)"><span class="	glyphicon glyphicon-trash" ></span></button>
                        </div>
                    </div>

                </div>
                <calendar ref="tuiCalendar" style="margin-bottom: 0; margin-top: 0"
                          :calendars="calendarList"
                          :schedules="scheduleList"
                          :view="view"
                          :taskView="taskView"
                          :scheduleView="scheduleView"
                          :theme="theme"
                          :week="week"
                          :month="month"
                          :disableDblClick="false"
                          :isReadOnly="isReadOnly"
                          :template="template"
                          :useCreationPopup="false"
                          :useDetailPopup="false"

                          @afterRenderSchedule="onAfterRenderSchedule"
                          @beforeCreateSchedule="onBeforeCreateSchedule"
                          @beforeUpdateSchedule="onBeforeUpdateSchedule"
                          @clickDayname="onClickDayname"
                          @clickSchedule="onClickSchedule"
                />
            </div>
        </div>
    </div>
</template>
<script>
    import 'tui-calendar/dist/tui-calendar.css'
    import Calendar from '@toast-ui/vue-calendar/src/Calendar.vue'


    // If you use the default popups, use this.
    import 'tui-date-picker/dist/tui-date-picker.css';
    import 'tui-time-picker/dist/tui-time-picker.css';
    import moment from 'moment';
    import Multiselect from 'vue-multiselect'
    import DateTimePicker from './DateTimePicker';
    import { createPopper } from '@popperjs/core';
    import $ from 'jquery'
    import TZDate from 'tzdate'

    function copyObject(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    function zeroPad(nr, base) {
        var len = (String(base).length - String(nr).length) + 1;
        return len > 0 ? new Array(len).join('0') + nr : nr;
    }


    export default {
        components: {
            'calendar': Calendar,
            'multi-select': Multiselect,
            'datetime-picker': DateTimePicker,
        },
        computed: {
            viewName() {
                if (this.view === 'day') {
                    return moment(new Date(this.dates.start)).format("DD.MM.YYYY");
                } else if (this.view === 'week') {
                    return moment(new Date(this.dates.start)).format("DD.MM.YYYY") + ' ~ ' + moment(new Date(this.dates.end)).format("DD.MM.YYYY");
                } else {
                    return moment(new Date(this.dates.start)).format("MM.YYYY");
                }
            },
        },
        watch: {
            element: {
                deep: true,
                handler(e) {
                    console.log("changed schedule component")
                    console.log(e)
                }
            }
           /* scheduleList: {
                deep: true,
                handler(e) {
                    console.log(e)

                },
            }*/
        },
        methods: {
            getScheduleById(id) {
                var num = 0;
                this.scheduleList.some((e, n) => {
                    if (e.id === id) {
                        num = n
                        return true
                    }
                });
                return this.scheduleList[num];
            },
            getScheduleColor(calendarId) {
                var color = '';
                this.calendarList.some(e=>{
                   if(e.id === calendarId) {
                       color = e.bgColor;
                       return true;
                   }
                });
                return color
            },
            createPopper(element) {
                let tooltip = document.querySelector('#view-schedule');
                let parent = document.querySelector('#calendar-view-block');
                console.log(tooltip)
                console.log(parent);
                let placement = 'right'
                if(this.view === 'day') {
                  placement = 'bottom'
                }
                this.popper = createPopper(element, tooltip , {
                    placement: placement,
                    modifiers: [
                        {
                            name: 'flip',
                            options: {
                                fallbackPlacements: ['top', 'left', 'bottom'],
                                padding: 300,
                                boundary: parent,
                                altBoundary: false,
                                flipVariations: true,
                            },
                        },
                        {
                            name: 'offset',
                            options: {
                                offset: [0, 4],
                            },
                        },
                    ],
                });
                this.$refs.tooltip.setAttribute('data-show', '');
            },
            getId() {
                var maxId = 0;
                this.scheduleList.forEach(e => {
                    let id = parseInt(e.id)
                    if (id > maxId) {
                        maxId = id;
                    }
                });
                return  1 + maxId;
            },
            duplicateSchedule() {
                let obj = copyObject(this.element)
                obj.id = -1
                this.saveSchedule(obj)
            },
            editSchedule() {
                this.$modal.show('edit-schedule');
            },

            deleteSchedule(schedule) {
                this.$confirm(
                    {
                        message: `Удалить запись '${schedule.title}'?`,
                        button: {
                            no: 'Нет',
                            yes: 'Да'
                        },
                        /**
                         * Callback Function
                         * @param {Boolean} confirm
                         */
                        callback: confirm => {
                            if (confirm) {
                                this.scheduleList.some( (e, num) => {
                                    if(e.id === schedule.id) {
                                        this.scheduleList.remove(num)
                                        return true;
                                    }
                                })
                            }
                        }
                    }
                )
            },
            saveSchedule(schedule = null) {
                if(schedule  === null) {
                    schedule = this.element
                }
                if (schedule.start instanceof Date) {
                    console.log("start instance of Date");
                } else if (schedule.start instanceof TZDate) {
                    console.log("start instance of TZDate")
                } else {
                    console.log("Unknown type of start " + (typeof schedule.start) + ". try convert to date")
                    schedule.start = new Date(schedule.start)
                }

                if (schedule.end instanceof Date) {
                    console.log("start instance of Date");
                } else if (schedule.end instanceof TZDate) {
                    console.log("start instance of TZDate")
                } else {
                    console.log("Unknown type of end " + (typeof schedule.end) + ". try convert to date")
                    schedule.end = new Date(schedule.end)
                }

                var groupIds = []
                if (typeof schedule.form !== 'undefined') {
                    if(typeof  schedule.form.calendar !== 'undefined') {
                        schedule.calendarId = schedule.form.calendar.id
                    }
                    if(typeof  schedule.form.employee !== 'undefined') {
                        schedule.employee = schedule.form.employee.id
                    }
                    schedule.form.groups.forEach(e => {
                        groupIds.push(e.id)
                    })
                    if(typeof  schedule.form.employee !== 'undefined' && typeof  schedule.form.calendar !== 'undefined') {
                        schedule.title = schedule.form.calendar.name + ' - ' + schedule.form.employee.name
                    }
                }



                console.log("try save element")
                console.log(schedule);

                if (schedule.id <= 0) {
                    let newId = this.getId();
                    console.log("New ID for element = "+newId)
                    this.scheduleList.push({
                        id: newId,
                        calendarId: schedule.form.calendar.id,
                        title: schedule.title,
                        category: 'time',
                        dueDateClass: '',
                        form: schedule.form,
                        start: schedule.start,
                        end: schedule.end,
                        employeeId: schedule.form.employee.id,
                        groupIds: groupIds,
                        isAllDay: schedule.isAllDay,
                    })
/*
                    this.$refs.tuiCalendar.invoke('createSchedules', [
                        {
                            id: this.getId(),
                            calendarId: schedule.form.calendar.id,
                            title: schedule.form.calendar.name + ' - ' + schedule.form.employee.name,
                            category: 'time',
                            dueDateClass: '',
                            start: new TZDate(schedule.start),
                            end: new TZDate(schedule.end),
                        }
                    ])*/
                } else {
                    var num = -1;
                    this.scheduleList.some((e, n) => {
                        if(e.id === schedule.id) {
                            num = n
                            return true;
                        }
                    });
                    this.$refs.tuiCalendar.invoke('updateSchedule', schedule.id, schedule.calendarId, {
                        start: schedule.start,
                        end: schedule.end,
                        title: schedule.title,
                    });
                    this.scheduleList[num] = schedule
                }
                this.$modal.hide('edit-schedule')
                return true
            },
            nextView() {
                this.$refs.tuiCalendar.invoke('next');
                this.dates.start = this.$refs.tuiCalendar.invoke('getDateRangeStart');
                this.dates.end = this.$refs.tuiCalendar.invoke('getDateRangeEnd');
            },
            prevView() {
                this.$refs.tuiCalendar.invoke('prev');
                this.dates.start = this.$refs.tuiCalendar.invoke('getDateRangeStart');
                this.dates.end = this.$refs.tuiCalendar.invoke('getDateRangeEnd');
            },
            today() {
                this.$refs.tuiCalendar.invoke('today');
                this.dates.start = this.$refs.tuiCalendar.invoke('getDateRangeStart');
                this.dates.end = this.$refs.tuiCalendar.invoke('getDateRangeEnd');
            },
            changeView(viewName) {
                this.view = viewName;
                console.log('Change view to ' + viewName)
            },
            onAfterRenderSchedule() {
                this.dates.start = this.$refs.tuiCalendar.invoke('getDateRangeStart');
                this.dates.end = this.$refs.tuiCalendar.invoke('getDateRangeEnd');
                // implement your code
            },
            onBeforeCreateSchedule(e) {
                console.log("Before create shedule called");
                e.guide.clearGuideElement();
                console.log(e);
                if(this.view === 'month' && e.triggerEventName === "dblclick") {
                    this.$refs.tuiCalendar.invoke('setDate', new Date(e.start));
                    this.changeView('day');
                    return
                }
                if(this.view === 'month') {
                    return;
                }

                if(((new Date(e.end).getTime() / 1000) - (new Date(e.start).getTime() / 1000)) <= 1800) {
                    return;
                }
                this.createModal({
                    start: new Date(e.start),
                    end: new Date(e.end),
                    isAllDay: e.isAllDay,
                })
                // implement your code
            },
            onBeforeUpdateSchedule(event) {
                var schedule = null;
                this.scheduleList.some( e => {
                    if(e.id === event.schedule.id) {
                        schedule = e
                        return true;
                    }
                    return  false;
                })
                if(schedule === null) {
                    console.log("Schedule not found");
                    alert("Error update schedule time - schedule not found in storage")
                }
                schedule.start = event.start
                schedule.end  = event.end
                this.saveSchedule(schedule)
                return true;
            },
            onClickDayname(e) {
                if (this.view !== 'day') {
                    this.$refs.tuiCalendar.invoke('setDate', new Date(e.date));
                    this.changeView('day');
                }
            },
            onClickSchedule(e) {
                console.log('Call onClickSchedule on id='+e.schedule.id);
                this.element = this.getScheduleById(e.schedule.id);
                this.createPopper(e.event.srcElement);
                // implement your code
            },
            resizeHandler() {
                console.log("Call re-render");
                this.$refs.tuiCalendar.invoke('render');
            },
            createModal(props = {start: null, end: null, isAllDay: false}) {
                this.element = {
                    id: -1,
                    calendarId: '',
                    title: '',
                    category: 'time',
                    start: new Date(),
                    end: new Date(),
                    employeeId: -1,
                    form: {
                        groups: [],
                        employee: null,
                        calendar: null,
                    },
                    groupIds: [],
                    isAllDay: props.isAllDay,
                }
                if (props.start !== null) {
                    this.element.start = props.start;
                }
                if (props.end !== null) {
                    this.element.end = props.end;
                }
                this.$modal.show('edit-schedule');
            }
        },
        created() {
            window.addEventListener("resize", this.resizeHandler);
        },
        destroyed() {
            window.removeEventListener("resize", this.resizeHandler);
        },
        data() {
            return {
                popper: null,
                groups: [
                    {id: 1, name: 'Софиевская Борщаговка'},
                    {id: 2, name: 'Киев'},
                    {id: 3, name: 'Умань'},
                    {id: 4, name: 'Одесса'},
                    {id: 5, name: 'Черкассы'},
                    {id: 6, name: 'Харьков'},
                    {id: 7, name: 'Рокитное'},
                    {id: 8, name: 'Херсон'},
                    {id: 9, name: 'Херосон'}
                ],
                employees: [
                    {id: 1, name: 'Приймук Андрей',},
                    {id: 2, name: 'Григорий Куцый',},
                    {id: 4, name: 'Дмитрий Куценко',},
                    {id: 9, name: 'Бояр Максим',},
                    {id: 5, name: 'Олександр Олейников',},
                ],
                loading: false,
                element: {
                    id:  -1,
                    calendarId: '',
                    title: '',
                    employeeId: -1,
                    form: {
                      groups: [],
                      employee: {},
                      calendar: {},
                    },
                    groupIds: [],
                    category: 'time',
                    start: new Date(),
                    end: new Date(),
                    focusTrap: false,
                    isAllDay: false,
                },calendarList: [
                    {
                        id: '0',
                        name: 'Дежурство',
                        color: '#ffffff',
                        bgColor: '#31B404',
                        dragBgColor: '#008f14',
                        borderColor: '#006805'
                    },
                    {
                        id: '1',
                        name: 'Маркетинг',
                        color: '#ffffff',
                        bgColor: '#3104B4',
                        dragBgColor: '#3104B4',
                        borderColor: '#3104B4'
                    },
                    {
                        id: '2',
                        name: 'Больничные',
                        color: '#ffffff',
                        bgColor: '#AEB404',
                        dragBgColor: '#AEB404',
                        borderColor: '#AEB404'
                    },
                    {
                        id: '3',
                        name: 'Отпуск',
                        color: '#ffffff',
                        bgColor: '#B40404',
                        dragBgColor: '#B40404',
                        borderColor: '#B40404'
                    },
                ],
                scheduleList: [
                    {
                        id: 101,
                        calendarId: '0',
                        title: 'Бояр Максим',
                        category: 'time',
                        dueDateClass: '',
                        start: new Date('2020-10-27 14:30:00'),
                        end: new Date('2020-10-27 19:30:00'),
                        employeeId: 9,
                        form: {
                            groups: [
                                {id: 1, name: 'Софиевская Борщаговка'},
                                {id: 2, name: 'Киев'},
                                {id: 7, name: 'Рокитное'},
                                {id: 8, name: 'Херсон'},
                            ],
                            employee: {
                                id: 9,
                                name: 'Бояр Максим'
                            },
                            calendar: {
                                id: '0',
                                name: 'Дежурство',
                                color: '#ffffff',
                                bgColor: '#31B404',
                                dragBgColor: '#3104B4',
                                borderColor: '#3104B4'
                            },
                        },
                        groupIds: [1,2,7,8],
                        focusTrap: false,
                        isAllDay: false,
                    },
                    {
                        id: 102,
                        calendarId: '0',
                        title: 'Приймук Андрей',
                        category: 'time',
                        dueDateClass: '',
                        start: new Date('2020-10-27 08:30:00'),
                        end: new Date('2020-10-27 13:30:00'),
                        employeeId: -1,
                        form: {
                            groups: [],
                            employee: null,
                            calendar: null,
                        },
                        groupIds: [],
                        focusTrap: false,
                        isAllDay: false,
                    }
                ],
                view: 'week',
                dates: {
                    start: '',
                    end: '',
                },
                taskView: false,
                scheduleView: ['time', 'allday'],
                theme: {
                    'month.dayname.height': '30px',
                    'month.dayname.borderLeft': '1px solid #ff0000',
                    'month.dayname.textAlign': 'center',
                    'week.today.color': '#333',
                    'week.daygridLeft.width': '100px',
                    'week.timegridLeft.width': '100px'
                },
                week: {
                    narrowWeekend: false,
                    showTimezoneCollapseButton: false,
                    timezonesCollapsed: false,
                    startDayOfWeek: 1,
                    daynames: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                    hourStart: 6,
                    hourEnd: 22,
                },
                month: {
                    visibleWeeksCount: 6,
                    startDayOfWeek: 1,
                    daynames: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                },
                disableDblClick: false,
                isReadOnly: false,
                template: {
                    milestone: function (schedule) {
                        return `<span style="color:red;">TEST ${schedule.title}</span>`;
                    },
                    milestoneTitle: function () {
                        return 'TASK';
                    },
                    timegridDisplayPrimayTime: function (shedule) {
                        return zeroPad(shedule.hour, '00') + ':' + zeroPad(shedule.minutes, '00');
                    },
                    taskTitle: function () {
                        return '<span class="tui-full-calendar-left-content">TASK</span>';
                    },
                    schedule: function () {

                        // use another functions instead of 'schedule'
                        // milestone: function() {...}
                        // task: function() {...}
                        // allday: function() {...}


                        return '';
                    },
                    task: function () {
                    },
                    time: function (s) {
                        return `${s.title}`;
                    },
                },
            }
        },
        mounted() {

            this.dates.start = this.$refs.tuiCalendar.invoke('getDateRangeStart');
            this.dates.end = this.$refs.tuiCalendar.invoke('getDateRangeEnd');
            $("body").on("click",function(e){
                if($(e.target).hasClass('tui-full-calendar-time-schedule-content')) {
                   return
                }
                if($(e.target).hasClass('tui-full-calendar-weekday-schedule')) {
                   return
                }
                if($(e.target).hasClass('tui-full-calendar-weekday-schedule-title')) {
                   return
                }
                if($(e.target).hasClass('not-close-view')) {
                   return
                }
                document.getElementById("view-schedule").removeAttribute('data-show');
            });
        }
    }
</script>
<style>

    .multiselect__tags {
        margin: 0 !important;
        color: black !important;
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
        border-color: #ccc !important;
        font-size: 13px !important;
        min-height: 40px !important;
    }

    .multiselect__placeholder {
        margin-bottom: 0 !important;
    }

    .multiselect__single {
        font-size: 13px !important;
        padding-top: 1px !important;
    }

    .input-group-addon {

    }

    .multiselect__option:hover {
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__option--highlight:after {
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__tag {
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__tag-icon:after {
        color: #F0F0F0 !important;
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__tag-icon {
        color: #C0C0C0 !important;
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }
    .tui-full-calendar-vlayout-container {
        overflow: hidden !important;
    }

    .multiselect__tag-icon:hover {
        color: #FAFAFA !important;
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__option--highlight {
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__option:active {
        background: #337ab7 !important;
        border-color: #2c3e50 !important;
    }

    .multiselect__spinner {
        font-size: 13px !important;
    }

    .multiselect__select {
        margin-top: 0px !important;
    }

    .vm--modal {
        overflow: visible !important;
        padding-top: 1px !important;
        padding-bottom: 10px !important;
    }

    .multiselect__input {
        font-size: 13px !important;
    }

    .multiselect {
        border: 0 !important;
        font-size: 13px !important;
        border-radius: 0 !important;
    }

    #view-schedule {
        background: #FAFAFA;
        color: black;
        font-size: 13px;
        border-radius: 4px;
        display: none;
        width: 250px;
        z-index: 99;
        -webkit-box-shadow: -2px 0px 14px 0px rgba(0,0,0,0.75);
        -moz-box-shadow: -2px 0px 14px 0px rgba(0,0,0,0.75);
        box-shadow: -2px 0px 14px 0px rgba(0,0,0,0.75);
    }
    #arrow,
    #arrow::before {
        position: absolute;
        width: 4px;
        height: 4px;
        z-index: -1;
    }

    #arrow::before {
        content: '';
        transform: rotate(45deg);
        background: #FAFAFA;

    }
    #view-schedule[data-popper-placement^='top'] > #arrow {
        bottom: -4px;
    }

    #view-schedule[data-popper-placement^='bottom'] > #arrow {
        top: -4px;
    }

    #view-schedule[data-popper-placement^='left'] > #arrow {
        right: 0px;
    }

    #view-schedule[data-popper-placement^='right'] > #arrow {
        left: -4px;
    }

    #view-schedule[data-show] {
        display: block !important;
    }
    .confirm-dialog {
        border-radius: 2px !important;
    }
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>