export const CODE_SNIPPETS = {
  MAIN: {
    title: "main.c - Entry Point",
    code: `int main(int argc, char **argv)
{
    t_data  data;

    if (argc < 5 || argc > 6)
    {
        printf("Usage: ./philo <number_of_philosophers> ");
        printf("<time_to_die> <time_to_eat> <time_to_sleep> [must_eat]\\n");
        return (1);
    }
    if (check_args(argc, argv) || init_data(&data, argc, argv))
        return (1);
    if (data.must_eat_count == 0)
        return (0);
    if (init_mutexes(&data) || init_philos(&data))
        return (cleanup(&data, 1), 1);
    if (start_simulation(&data))
        return (cleanup(&data, 2), 1);
    return (cleanup(&data, 2), 0);
}`
  },
  THINKING: {
    title: "philo_routine.c - Think Routine",
    code: `void think_routine(t_philo *philo)
{
    long long   think_time;
    long long   time_since_meal;

    print_status(philo, "is thinking");
    pthread_mutex_lock(&philo->data->meal_lock);
    time_since_meal = get_time() - philo->last_meal_time;
    pthread_mutex_unlock(&philo->data->meal_lock);
    think_time = (philo->data->time_to_die - time_since_meal
            - philo->data->time_to_eat) / 2;
    if (think_time < 0)
        think_time = 0;
    if (think_time > 200)
        think_time = 200;
    if (think_time > 0)
        ft_usleep(think_time, philo->data);
}`
  },
  HUNGRY: {
    title: "philo_routine.c - Eat Routine",
    code: `void eat_routine(t_philo *philo)
{
    pthread_mutex_lock(philo->left_fork);
    print_status(philo, "has taken a fork");
    if (philo->data->num_philos == 1)
    {
        ft_usleep(philo->data->time_to_die, philo->data);
        pthread_mutex_unlock(philo->left_fork);
        return ;
    }
    pthread_mutex_lock(philo->right_fork);
    print_status(philo, "has taken a fork");
    pthread_mutex_lock(&philo->data->meal_lock);
    philo->last_meal_time = get_time();
    pthread_mutex_unlock(&philo->data->meal_lock);
    print_status(philo, "is eating");
    ft_usleep(philo->data->time_to_eat, philo->data);
    pthread_mutex_lock(&philo->data->meal_lock);
    philo->eat_count++;
    pthread_mutex_unlock(&philo->data->meal_lock);
    pthread_mutex_unlock(philo->right_fork);
    pthread_mutex_unlock(philo->left_fork);
}`
  },
  EATING: {
    title: "philo_routine.c - Main Loop",
    code: `void *philo_routine(void *arg)
{
    t_philo *philo;

    philo = (t_philo *)arg;
    wait_for_start(philo->data);
    if (philo->id % 2 == 0)
        ft_usleep(1, philo->data);
    while (!is_dead(philo->data))
    {
        eat_routine(philo);
        if (philo->data->num_philos == 1)
            break ;
        if (is_dead(philo->data))
            break ;
        print_status(philo, "is sleeping");
        ft_usleep(philo->data->time_to_sleep, philo->data);
        if (is_dead(philo->data))
            break ;
        think_routine(philo);
    }
    return (NULL);
}`
  },
  SLEEPING: {
    title: "init.c - Assign Forks",
    code: `static void assign_forks(t_philo *philo, t_data *data, int i)
{
    if (i % 2 == 0)
    {
        philo->left_fork = &data->forks[i];
        philo->right_fork = &data->forks[(i + 1) % data->num_philos];
    }
    else
    {
        philo->left_fork = &data->forks[(i + 1) % data->num_philos];
        philo->right_fork = &data->forks[i];
    }
}

int init_philos(t_data *data)
{
    int i;

    data->philos = malloc(sizeof(t_philo) * data->num_philos);
    if (!data->philos)
        return (1);
    i = 0;
    while (i < data->num_philos)
    {
        data->philos[i].id = i + 1;
        data->philos[i].eat_count = 0;
        data->philos[i].last_meal_time = 0;
        data->philos[i].data = data;
        assign_forks(&data->philos[i], data, i);
        i++;
    }
    return (0);
}`
  },
  DEATH: {
    title: "monitor.c - Death Check",
    code: `static int check_philo_death(t_data *data)
{
    int         i;
    long long   time;

    i = 0;
    while (i < data->num_philos)
    {
        pthread_mutex_lock(&data->meal_lock);
        time = get_time() - data->philos[i].last_meal_time;
        if (time > data->time_to_die)
        {
            pthread_mutex_unlock(&data->meal_lock);
            set_dead(data);
            pthread_mutex_lock(&data->write_lock);
            printf("%lld %d died\\n", 
                get_time() - data->start_time,
                data->philos[i].id);
            pthread_mutex_unlock(&data->write_lock);
            return (1);
        }
        pthread_mutex_unlock(&data->meal_lock);
        i++;
    }
    return (0);
}

void *monitor_routine(void *arg)
{
    t_data  *data;

    data = (t_data *)arg;
    wait_for_start(data);
    while (!is_dead(data))
    {
        if (check_philo_death(data) || check_all_ate(data))
            break ;
        usleep(500);
    }
    return (NULL);
}`
  }
};

export type CodeSnippetKey = keyof typeof CODE_SNIPPETS;
